enum OrderStatus {
    RequestReceived = "REQUEST_RECEIVED",
    PendingDispatch = "PENDING_DISPATCH",
    PendingRelease = "PENDING_RELEASE",
    PendingAutoretry = "PENDING_AUTORETRY",
    EstimatesReceived = "ESTIMATES_RECEIVED",
    EstimatesFailed = "ESTIMATES_FAILED",
    OrderDispatched = "ORDER_DISPATCHED",
    Staged = "STAGED",
    OrderFailed = "ORDER_FAILED",
    OrderAssigned = "ORDER_ASSIGNED",
    OrderUnassigned = "ORDER_UNASSIGNED",
    PickupStarted = "PICKUP_STARTED",
    PickupCompleted = "PICKUP_COMPLETED",
    InTransit = "IN_TRANSIT",
    OutForDelivery = "OUT_FOR_DELIVERY",
    OrderAtLocation = "ORDER_AT_LOCATION",
    OrderDelivered = "ORDER_DELIVERED",
    OrderDelayed = "ORDER_DELAYED",
    OrderRedelivery = "ORDER_REDELIVERY",
    OrderUndeliverable = "ORDER_UNDELIVERABLE",
    ErrorException = "ERROR_EXCEPTION",
    OrderCancelled = "ORDER_CANCELLED"
}

export { OrderStatus }