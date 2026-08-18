from tools.workflow import record_event


def execute_skill(skill, ticket_id, order_id, amount):

    if not skill:
        return {
            "status": "Failed",
            "message": "No reusable skill available."
        }

    executed_steps = []

    # Open Ticket
    if "Open customer ticket" in skill["steps"]:

        record_event(
            "Skill: Open Ticket",
            f"Automatically opened ticket {ticket_id}"
        )

        executed_steps.append(
            f"Opened customer ticket {ticket_id}"
        )

    # Check Order
    if "Check customer order" in skill["steps"]:

        record_event(
            "Skill: Check Order",
            f"Automatically checked order {order_id}"
        )

        executed_steps.append(
            f"Checked customer order {order_id}"
        )

    # Check Refund Policy
    if "Check refund policy" in skill["steps"]:

        record_event(
            "Skill: Check Refund Policy",
            "Automatically checked refund policy"
        )

        executed_steps.append(
            "Checked refund policy"
        )

    # Refund decision
    if amount <= 5000:

        record_event(
            "Skill: Auto Approve Refund",
            f"Refund of ₹{amount} automatically approved"
        )

        executed_steps.append(
            f"Automatically approved refund of ₹{amount}"
        )

        return {
            "status": "Completed",
            "decision": "Automatically Approved",
            "amount": amount,
            "manager_required": False,
            "executed_steps": executed_steps
        }

    else:

        record_event(
            "Skill: Request Manager Approval",
            f"Refund of ₹{amount} requires manager approval"
        )

        executed_steps.append(
            f"Manager approval required for ₹{amount}"
        )

        return {
            "status": "Waiting for Approval",
            "decision": "Manager Approval Required",
            "amount": amount,
            "manager_required": True,
            "executed_steps": executed_steps
        }