class Dimension {
    height!: number
    width!: number
    length!: number
}

class DeliveryNotification {
    email: string[] = []
    sms: string[] = []
    url?: string
}

class TimeWindow {
    startsAt!: number
    endsAt!: number
}

export { Dimension, TimeWindow, DeliveryNotification }
