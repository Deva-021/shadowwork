from tools.workflow import record_event
from tools.knowledge import get_refund_policy

approvals = {}


def process_refund(ticket_id, amount):
    policy = get_refund_policy()

    if amount <= policy["approval_limit"]:
        record_event(
            "Auto Approve Refund",
            f"Ticket #{ticket_id}, Amount ₹{amount}"
        )

        return {
            "ticket_id": ticket_id,
            "amount": amount,
            "status": "Approved",
            "manager_required": False,
            "reason": "Refund is within the automatic approval limit."
        }

    approval_id = len(approvals) + 1

    approvals[approval_id] = {
        "approval_id": approval_id,
        "ticket_id": ticket_id,
        "amount": amount,
        "status": "Pending"
    }

    record_event(
        "Request Manager Approval",
        f"Ticket #{ticket_id}, Amount ₹{amount}"
    )

    return approvals[approval_id]


def get_approval(approval_id):
    return approvals.get(approval_id)


def update_approval(approval_id, status):
    if approval_id in approvals:
        approvals[approval_id]["status"] = status

        record_event(
            "Update Approval",
            f"Approval #{approval_id} → {status}"
        )

        return approvals[approval_id]

    return None