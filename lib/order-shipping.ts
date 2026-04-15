import { getSupabaseAdmin } from '@/lib/supabase/admin'
import {
  assertCompleteShippingProfile,
  buildQuoteProducts,
  buildShippingDeclarationProducts,
  buildRecipientAddress,
  buildSenderAddress,
  buildVolumeFromItems,
  convertWeightGramsToKg,
  normalizeShippingOptions,
  pickOriginPostalCode
} from '@/lib/shipping'
import {
  checkoutSuperFreteOrder,
  createSuperFreteOrder,
  getSuperFreteAddresses,
  getSuperFreteUser,
  quoteSuperFrete
} from '@/lib/superfrete'

type ItemProduct = {
  id: string
  name: string | null
  price_text: string | null
  quantity: number | null
  package_weight_grams: number | null
  package_height_cm: number | string | null
  package_width_cm: number | string | null
  package_length_cm: number | string | null
}

type CheckoutItem = {
  quantity: number
  product: ItemProduct
}

type UserProfile = {
  full_name: string | null
  phone: string | null
  document: string | null
  address_line1: string | null
  address_line2: string | null
  address_number: string | null
  district: string | null
  city: string | null
  state: string | null
  postal_code: string | null
}

export async function getCheckoutProfile(userId: string) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data: profile, error } = await supabaseAdmin
    .from('users')
    .select(
      'full_name, phone, document, address_line1, address_line2, address_number, district, city, state, postal_code'
    )
    .eq('id', userId)
    .maybeSingle()

  if (error || !profile) {
    throw new Error(error?.message || 'User profile not found')
  }

  return profile as UserProfile
}

export async function quoteShippingForItems(params: {
  profile: UserProfile
  items: CheckoutItem[]
}) {
  assertCompleteShippingProfile(params.profile)
  const addresses = await getSuperFreteAddresses()
  const originPostalCode = pickOriginPostalCode(addresses)
  const volume = buildVolumeFromItems(params.items)
  const products = buildQuoteProducts(params.items)
  const packageDimensions = {
    height: volume.height,
    width: volume.width,
    length: volume.length,
    weight: convertWeightGramsToKg(volume.weight)
  }

  const quoteResponse = await quoteSuperFrete({
    from: { postal_code: originPostalCode },
    to: { postal_code: params.profile.postal_code || '' },
    services: '1,2,17,3',
    package: packageDimensions,
    products,
    options: {
      own_hand: false,
      receipt: false,
      insurance_value: 0,
      use_insurance_value: false
    }
  })

  return {
    options: normalizeShippingOptions(Array.isArray(quoteResponse) ? quoteResponse : []),
    volume
  }
}

export async function purchaseShippingLabel(params: {
  orderId: string
  buyerEmail: string
  profile: UserProfile
  items: CheckoutItem[]
  serviceCode: number
}) {
  const supabaseAdmin = getSupabaseAdmin()
  const [addresses, superFreteUser] = await Promise.all([getSuperFreteAddresses(), getSuperFreteUser()])
  const sender = buildSenderAddress(addresses, superFreteUser)
  const recipient = buildRecipientAddress(params.profile, params.buyerEmail)
  const volume = buildVolumeFromItems(params.items)
  const products = buildShippingDeclarationProducts(params.items)
  const shippingVolume = {
    height: volume.height,
    width: volume.width,
    length: volume.length,
    weight: convertWeightGramsToKg(volume.weight)
  }

  const superFreteOrder = await createSuperFreteOrder({
    from: sender,
    to: recipient,
    service: params.serviceCode,
    products,
    volumes: shippingVolume,
    options: {
      own_hand: false,
      receipt: false,
      insurance_value: null,
      non_commercial: true
    },
    platform: 'Nathalia Malinowski'
  })

  const createdOrders = Array.isArray(superFreteOrder?.orders) ? superFreteOrder.orders : []
  const firstOrder = createdOrders[0] || superFreteOrder?.order || superFreteOrder
  const superFreteOrderId = String(firstOrder?.id || '')
  if (!superFreteOrderId) {
    throw new Error('SuperFrete did not return an order id')
  }

  const checkoutResult = await checkoutSuperFreteOrder([superFreteOrderId])
  const paidOrders = Array.isArray(checkoutResult?.orders) ? checkoutResult.orders : []
  const paidOrder =
    paidOrders.find((entry: any) => String(entry?.id || '') === superFreteOrderId) || paidOrders[0] || firstOrder

  const updatePayload = {
    shipping_status: 'label_paid',
    shipping_tracking_code: paidOrder?.tracking || firstOrder?.tracking || null,
    shipping_label_url: paidOrder?.print?.url || firstOrder?.print?.url || null,
    shipping_tracking_url: paidOrder?.tracking_url || firstOrder?.tracking_url || null,
    shipping_error_message: null,
    superfrete_order_id: superFreteOrderId,
    superfrete_order_data: superFreteOrder,
    superfrete_checkout_data: checkoutResult,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabaseAdmin.from('orders').update(updatePayload).eq('id', params.orderId)
  if (error) {
    throw new Error(error.message)
  }

  return updatePayload
}
