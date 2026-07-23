import RecruitmentCharts from "./RecruitmentCharts";

const RecruitmentDashboard = ({ dashboard, loading }) => {
  const cards = dashboard?.cards || {};

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading recruitment dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Recruitment Dashboard</h4>

      <div className="row">
        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Job Openings</h6>
              <h3>{cards.totalJobOpenings || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Candidates</h6>
              <h3 className="text-primary">{cards.totalCandidates || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Shortlisted</h6>
              <h3 className="text-info">{cards.candidatesShortlisted || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Hired</h6>
              <h3 className="text-success">{cards.candidatesHired || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Pending Onboarding Tasks</h6>
              <h3 className="text-warning">
                {cards.pendingOnboardingTasks || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Onboarding Completion</h6>
              <h3 className="text-dark">
                {cards.onboardingCompletionPercentage || 0}
                <small className="fs-6">%</small>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <RecruitmentCharts
        applicationsByDepartment={dashboard?.applicationsByDepartment || []}
        candidateStatusDistribution={
          dashboard?.candidateStatusDistribution || []
        }
        monthlyHiringTrend={dashboard?.monthlyHiringTrend || []}
        onboardingCompletion={dashboard?.onboardingCompletion || []}
      />
    </div>
  );
};

export default RecruitmentDashboard;
