def analyze_workflow(events):
    """
    Analyze recorded employee workflow events
    and identify a reusable workflow pattern.
    """

    if not events:
        return {
            "status": "No workflow recorded",
            "message": "Perform some employee actions first."
        }

    steps = []

    for index, event in enumerate(events, start=1):
        steps.append({
            "step": index,
            "action": event["action"],
            "details": event["details"],
            "timestamp": event["timestamp"]
        })

    # Detect important workflow actions
    actions = [event["action"].lower() for event in events]

    has_ticket = any("ticket" in action for action in actions)
    has_order = any("order" in action for action in actions)
    has_refund = any("refund" in action for action in actions)
    has_approval = any("approval" in action for action in actions)

    # Identify workflow type
    if has_ticket and has_order and has_refund:
        workflow_type = "Customer Refund Processing"

    elif has_ticket and has_order:
        workflow_type = "Customer Support Workflow"

    else:
        workflow_type = "Custom Employee Workflow"

    # Generate reusable skill
    skill_steps = []

    if has_ticket:
        skill_steps.append("Open customer ticket")

    if has_order:
        skill_steps.append("Check customer order")

    if has_refund:
        skill_steps.append("Check refund policy")

    if has_approval:
        skill_steps.append("Process refund approval when required")

    return {
        "status": "Workflow analyzed",
        "workflow_type": workflow_type,
        "total_steps": len(steps),
        "observed_steps": steps,
        "reusable_skill": {
            "name": workflow_type,
            "description": "Reusable workflow discovered from employee actions.",
            "steps": skill_steps
        }
    }