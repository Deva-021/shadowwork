from tools.workflow import record_event

orders = {
    4521: {
        "order_id": 4521,
        "customer": "Rahul",
        "product": "Laptop",
        "amount": 3500,
        "status": "Delivered",
        "days_since_purchase": 10
    },
    7821: {
        "order_id": 7821,
        "customer": "Arjun",
        "product": "Headphones",
        "amount": 12000,
        "status": "Delivered",
        "days_since_purchase": 5
    }
}


def get_order(order_id):
    order = orders.get(order_id)

    if order:
        record_event(
            "Check Order",
            f"Order #{order_id}"
        )

    return order