from tools.workflow import record_event

refund_policy = {
    "refund_period_days": 15,
    "approval_limit": 5000,
    "policy": "Refunds are allowed within 15 days. Refunds above ₹5,000 require manager approval."
}


def get_refund_policy():
    record_event(
        "Check Refund Policy",
        "Refund policy"
    )

    return refund_policy