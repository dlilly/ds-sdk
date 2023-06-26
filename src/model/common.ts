type Dimension = {
    height: number
    width: number
    length: number
}

type DeliveryNotification = {
    email: string[]
    sms: string[]
    url: string
}

type TimeWindow = {
    startsAt: number
    endsAt: number
}

type DeliverySolutionsBaseType = {
    _id: string
}

type Activatible = {
    active: boolean
}

const TimingTypes = ['location', 'pickup', 'delivery'] as const
type TimingType = typeof TimingTypes[number]

type TimingQuery = {
    type: TimingType
    queryKey: string
    queryId: string
}

type BrandTimingQuery = TimingQuery & {
    queryKey: 'brandExternalId'
}

type StoreTimingQuery = TimingQuery & {
    queryKey: 'storeExternalId'
}

export { Dimension, TimeWindow, DeliveryNotification, Activatible, DeliverySolutionsBaseType, TimingTypes, TimingType, TimingQuery, BrandTimingQuery, StoreTimingQuery }
