import React from 'react';
import '../styles/FinancialSidebar.css';

const FinancialSidebar = () => {
  return (
    <div className="financial-sidebar">
      {/* Quick Overview Section */}
      <section className="sidebar-section overview">
        <h2>Financial Overview</h2>
        <div className="stat-card">
          <span className="label">Net Worth</span>
          <span className="value">$84,532</span>
          <span className="trend positive">+2.4%</span>
        </div>
        <div className="mini-stats">
          <div className="stat-item">
            <span className="label">Monthly Income</span>
            <span className="value">$5,200</span>
          </div>
          <div className="stat-item">
            <span className="label">Monthly Expenses</span>
            <span className="value">$3,800</span>
          </div>
          <div className="stat-item">
            <span className="label">Savings Rate</span>
            <span className="value">27%</span>
          </div>
        </div>
      </section>

      {/* Financial Health Section */}
      <section className="sidebar-section health">
        <h2>Financial Health</h2>
        <div className="health-metrics">
          <div className="metric">
            <div className="metric-header">
              <span>Credit Score</span>
              <span className="score good">742</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '74%' }}></div>
            </div>
          </div>
          <div className="metric">
            <div className="metric-header">
              <span>Emergency Fund</span>
              <span className="months">4.2 mo</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
        <div className="portfolio-distribution">
          <h3>Portfolio</h3>
          <div className="mock-pie-chart"></div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="sidebar-section activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="date">Today</span>
            <span className="description">Grocery Shopping</span>
            <span className="amount expense">-$142.50</span>
          </div>
          <div className="activity-item">
            <span className="date">Yesterday</span>
            <span className="description">Salary Deposit</span>
            <span className="amount income">+$2,600.00</span>
          </div>
          <div className="activity-item">
            <span className="date">Jun 12</span>
            <span className="description">Investment Return</span>
            <span className="amount income">+$380.25</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialSidebar; 