// Supporting table for onboarding tasks — lists assigned tasks and lets
// employees mark their own tasks as completed.
const OnboardingTaskTable = ({ tasks, isAdmin, onComplete }) => {
  return (
    <div className="card p-3 mb-4">
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Task</th>
              <th>Assigned By</th>
              <th>Due Date</th>
              <th>Status</th>
              {!isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 5} className="text-center">
                  No onboarding tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  {isAdmin && (
                    <td>
                      {task.employee_name} ({task.department})
                    </td>
                  )}
                  <td>{task.task_name}</td>
                  <td>{task.assigned_by}</td>
                  <td>{task.due_date?.slice(0, 10)}</td>
                  <td>
                    <span
                      className={`badge ${
                        task.status === "Completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  {!isAdmin && (
                    <td>
                      {task.status === "Pending" && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onComplete(task.id)}
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnboardingTaskTable;
