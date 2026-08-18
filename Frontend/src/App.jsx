import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [ticketId, setTicketId] = useState("1001");
  const [orderId, setOrderId] = useState("4521");
  const [amount, setAmount] = useState("3500");

  const [ticket, setTicket] = useState(null);
  const [order, setOrder] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [refundResult, setRefundResult] = useState(null);

  const [events, setEvents] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [message, setMessage] = useState("");

  async function refreshEvents() {
    try {
      const response = await fetch(`${API}/workflow/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function openTicket() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/ticket/${ticketId}`);
      const data = await response.json();

      setTicket(data);
      await refreshEvents();
      setMessage("Ticket opened successfully.");
    } catch (error) {
      setMessage("Could not connect to ShadowWork backend.");
    }

    setLoading(false);
  }

  async function checkOrder() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/order/${orderId}`);
      const data = await response.json();

      setOrder(data);
      await refreshEvents();
      setMessage("Order checked successfully.");
    } catch (error) {
      setMessage("Could not connect to ShadowWork backend.");
    }

    setLoading(false);
  }

  async function checkPolicy() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/refund-policy`);
      const data = await response.json();

      setPolicy(data);
      await refreshEvents();
      setMessage("Refund policy checked.");
    } catch (error) {
      setMessage("Could not connect to ShadowWork backend.");
    }

    setLoading(false);
  }

  async function processRefund() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/refund/${ticketId}/${amount}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setRefundResult(data);
      await refreshEvents();

      if (data.manager_required === false) {
        setMessage("Refund automatically approved.");
      } else {
        setMessage("Manager approval is required.");
      }
    } catch (error) {
      setMessage("Could not connect to ShadowWork backend.");
    }

    setLoading(false);
  }

  // Analyze recorded employee workflow
  async function analyzeWorkflow() {
    setAnalyzing(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/workflow/analyze`);

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setAnalysis(data);
      setMessage("Workflow analyzed successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not analyze workflow.");
    }

    setAnalyzing(false);
  }

  // Execute the generated reusable skill
  // Execute the generated reusable skill
async function executeSkill() {
  setExecuting(true);
  setMessage("");
  setExecutionResult(null);

  try {
    const response = await fetch(
      `${API}/workflow/execute?ticket_id=${ticketId}&order_id=${orderId}&amount=${amount}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Skill execution failed");
    }

    const data = await response.json();

    // Show generated skill result
    setExecutionResult(data);

    // IMPORTANT:
    // Update the refund decision box with the NEW amount/result
    setRefundResult({
      manager_required: data.manager_required,
      reason: data.manager_required
        ? `Refund of ₹${data.amount} requires manager approval.`
        : `Refund of ₹${data.amount} is within the automatic approval limit.`,
    });

    // Refresh Observer timeline
    await refreshEvents();

    if (data.status === "Completed") {
      setMessage("Generated skill executed successfully.");
    } else if (data.status === "Waiting for Approval") {
      setMessage("Skill execution reached manager approval.");
    } else {
      setMessage(data.message || "Skill execution failed.");
    }

  } catch (error) {
    console.error(error);
    setMessage("Could not execute generated skill.");
  }

  setExecuting(false);
}

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>ShadowWork</h1>
          <p>AI Workflow Discovery Platform</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>


      {/* DASHBOARD */}
      <main className="dashboard">

        {/* EMPLOYEE WORKSPACE */}
        <section className="workspace">

          <div className="section-title">
            <div>
              <h2>Employee Workspace</h2>
              <p>Perform your normal customer support workflow.</p>
            </div>
          </div>


          <div className="card">

            {/* STEP 1 */}
            <div className="step">

              <div className="step-number">1</div>

              <div className="step-content">

                <h3>Open Customer Ticket</h3>

                <label>Ticket ID</label>

                <div className="input-row">

                  <input
                    type="number"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                  />

                  <button
                    onClick={openTicket}
                    disabled={loading}
                  >
                    Open Ticket
                  </button>

                </div>

                {ticket && (
                  <div className="result">

                    <strong>{ticket.customer}</strong>

                    <span>{ticket.issue}</span>

                    <span>
                      Status: {ticket.status}
                    </span>

                  </div>
                )}

              </div>

            </div>


            {/* STEP 2 */}
            <div className="step">

              <div className="step-number">2</div>

              <div className="step-content">

                <h3>Check Order</h3>

                <label>Order ID</label>

                <div className="input-row">

                  <input
                    type="number"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />

                  <button
                    onClick={checkOrder}
                    disabled={loading}
                  >
                    Check Order
                  </button>

                </div>

                {order && (
                  <div className="result">

                    <strong>{order.product}</strong>

                    <span>
                      ₹{order.amount}
                    </span>

                    <span>
                      {order.status}
                    </span>

                    <span>
                      Purchased {order.days_since_purchase} days ago
                    </span>

                  </div>
                )}

              </div>

            </div>


            {/* STEP 3 */}
            <div className="step">

              <div className="step-number">3</div>

              <div className="step-content">

                <h3>Check Refund Policy</h3>

                <button
                  className="secondary-button"
                  onClick={checkPolicy}
                  disabled={loading}
                >
                  Check Refund Policy
                </button>

                {policy && (
                  <div className="policy">

                    <div>
                      <strong>
                        Refund period
                      </strong>

                      <span>
                        {policy.refund_period_days} days
                      </span>
                    </div>

                    <div>
                      <strong>
                        Auto-approval limit
                      </strong>

                      <span>
                        ₹{policy.approval_limit}
                      </span>
                    </div>

                  </div>
                )}

              </div>

            </div>


            {/* STEP 4 */}
            <div className="step">

              <div className="step-number">4</div>

              <div className="step-content">

                <h3>Process Refund</h3>

                <label>Refund Amount</label>

                <div className="input-row">

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <button
                    onClick={processRefund}
                    disabled={loading}
                  >
                    Process Refund
                  </button>

                </div>

                {refundResult && (
                  <div
                    className={
                      refundResult.manager_required
                        ? "decision manager"
                        : "decision approved"
                    }
                  >

                    <strong>
                      {refundResult.manager_required
                        ? "Manager Approval Required"
                        : "Automatically Approved"}
                    </strong>

                    <span>
                      {refundResult.reason}
                    </span>

                  </div>
                )}

              </div>

            </div>

          </div>


          {/* MESSAGE */}
          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </section>


        {/* OBSERVER */}
        <aside className="observer">

          <div className="observer-header">

            <div>

              <h2>ShadowWork Observer</h2>

              <p>
                Watching employee workflow
              </p>

            </div>

            <span className="live">
              LIVE
            </span>

          </div>


          {/* OBSERVATION */}
          <div className="observation-box">

            {events.length === 0 ? (

              <div className="empty">

                <div className="empty-icon">
                  ◉
                </div>

                <h3>
                  Waiting for activity
                </h3>

                <p>
                  Perform actions on the left.
                  ShadowWork will automatically
                  observe and record them.
                </p>

              </div>

            ) : (

              <div className="timeline">

                {events.map((event, index) => (

                  <div
                    className="timeline-item"
                    key={index}
                  >

                    <div className="timeline-line">

                      <div className="timeline-dot"></div>

                      {index !== events.length - 1 && (
                        <div className="timeline-connector"></div>
                      )}

                    </div>


                    <div className="timeline-content">

                      <div className="event-top">

                        <strong>
                          {event.action}
                        </strong>

                        <span>
                          {event.timestamp}
                        </span>

                      </div>

                      <p>
                        {event.details}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* ANALYZE BUTTON */}
          <div className="analysis-section">

            <button
              className="analyze-button"
              onClick={analyzeWorkflow}
              disabled={analyzing || events.length === 0}
            >

              {analyzing
                ? "Analyzing Workflow..."
                : "✦ Analyze Workflow"}

            </button>

          </div>


          {/* AI ANALYSIS RESULT */}
          {analysis && (
            <div className="analysis-box">

              <div className="analysis-header">

                <div className="learning-icon">
                  ✦
                </div>

                <div>

                  <h3>
                    AI Workflow Analysis
                  </h3>

                  <span>
                    {analysis.status}
                  </span>

                </div>

              </div>


              <div className="analysis-content">

                <div className="analysis-item">

                  <strong>
                    Workflow Type
                  </strong>

                  <span>
                    {analysis.workflow_type}
                  </span>

                </div>


                <div className="analysis-item">

                  <strong>
                    Steps Observed
                  </strong>

                  <span>
                    {analysis.total_steps}
                  </span>

                </div>


                {analysis.reusable_skill && (
                  <div className="skill">

                    <h4>
                      Reusable Skill
                    </h4>

                    <p>
                      {analysis.reusable_skill.name}
                    </p>


                    <ul>

                      {analysis.reusable_skill.steps.map(
                        (step, index) => (
                          <li key={index}>
                            {step}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}


                {/* RUN GENERATED SKILL */}
                {analysis.reusable_skill && (
                  <div className="execution-section">

                    <button
                      className="execute-button"
                      onClick={executeSkill}
                      disabled={executing}
                    >

                      {executing
                        ? "Running Generated Skill..."
                        : "▶ Run Generated Skill"}

                    </button>

                  </div>
                )}


                {/* EXECUTION RESULT */}
                {executionResult && (
                  <div className="execution-result">

                    <h3>
                      Skill Execution Result
                    </h3>

                    <strong>
                      {executionResult.decision}
                    </strong>

                    {executionResult.executed_steps && (
                      <ul>

                        {executionResult.executed_steps.map(
                          (step, index) => (
                            <li key={index}>
                              {step}
                            </li>
                          )
                        )}

                      </ul>
                    )}

                  </div>
                )}

              </div>

            </div>
          )}


          {/* LEARNING BOX */}
          <div className="learning-box">

            <div className="learning-icon">
              ✦
            </div>

            <div>

              <h3>
                Workflow Learning
              </h3>

              <p>
                ShadowWork observes how the employee
                completes the task. The recorded workflow
                can be analyzed to discover a reusable
                agent skill.
              </p>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default App;