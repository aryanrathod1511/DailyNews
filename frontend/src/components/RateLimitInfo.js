import React from 'react';

const RateLimitInfo = () => {
  return (
    <div className="container mt-5 pt-5">
      <div className="page-title">
        <h1 className="mb-0">
          <i className="fas fa-chart-line me-3"></i>
          API Usage Information
        </h1>
        <p className="mb-0 mt-2 opacity-75">
          Monitor your API usage and optimize your requests
        </p>
      </div>
      
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <h5 className="mb-0">
            <i className="fas fa-info-circle me-2"></i>
            Current Plan: Free Tier
          </h5>
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-primary mb-3">
                <i className="fas fa-check-circle me-2"></i>
                Plan Features
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  <strong>200 requests per day</strong>
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  <strong>Indian news coverage</strong>
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  <strong>Multiple categories</strong>
                </li>
                <li className="mb-2">
                  <i className="fas fa-times text-danger me-2"></i>
                  <strong>No advanced features</strong>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-primary mb-3">
                <i className="fas fa-lightbulb me-2"></i>
                Usage Optimization Tips
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-sync-alt text-info me-2"></i>
                  <strong>Refresh pages less frequently</strong>
                </li>
                <li className="mb-2">
                  <i className="fas fa-mobile-alt text-info me-2"></i>
                  <strong>Use one category at a time</strong>
                </li>
                <li className="mb-2">
                  <i className="fas fa-clock text-info me-2"></i>
                  <strong>Wait for daily reset (24 hours)</strong>
                </li>
                <li className="mb-2">
                  <i className="fas fa-credit-card text-info me-2"></i>
                  <strong>Consider upgrading for more requests</strong>
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="my-4" />
          
          <div className="row">
            <div className="col-12">
              <h6 className="text-primary mb-3">
                <i className="fas fa-tools me-2"></i>
                Alternative Solutions
              </h6>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card border-primary h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-clock text-primary mb-3" style={{fontSize: '2rem'}}></i>
                      <h6>Wait & Reset</h6>
                      <p className="small text-muted">Your limit resets every 24 hours</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-success h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-arrow-up text-success mb-3" style={{fontSize: '2rem'}}></i>
                      <h6>Upgrade Plan</h6>
                      <p className="small text-muted">Get more requests with paid plans</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-info h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-newspaper text-info mb-3" style={{fontSize: '2rem'}}></i>
                      <h6>Use Current Data</h6>
                      <p className="small text-muted">Browse existing articles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a 
              href="https://newsdata.io/pricing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg me-3"
            >
              <i className="fas fa-external-link-alt me-2"></i>
              View Pricing Plans
            </a>
            <a 
              href="https://newsdata.io/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-lg"
            >
              <i className="fas fa-book me-2"></i>
              API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitInfo; 