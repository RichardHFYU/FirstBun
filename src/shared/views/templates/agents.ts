export const template = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agents Directory</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <style>
        .card { transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .search-container { background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 30px; }
        .loading { opacity: 0.5; }
    </style>
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand" href="/"><i class="bi bi-people-fill me-2"></i>Agents Directory</a>
        </div>
    </nav>

    <div class="container py-4">
        <div class="search-container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="number" 
                               id="agentId" 
                               class="form-control form-control-lg" 
                               placeholder="Search by Agent ID">
                    </div>
                </div>
            </div>
        </div>

        <div id="agentList" class="row g-4"></div>
    </div>

    <!-- Add Modal for Sales Details -->
    <div class="modal fade" id="salesModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Agent Sales Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="salesDetails"></div>
                </div>
            </div>
        </div>
    </div>

    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container text-center">
            <p class="mb-0">&copy; 2024 Agents Directory. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let salesModal;

        window.onload = function() {
            salesModal = new bootstrap.Modal(document.getElementById('salesModal'));
        }

        async function loadAllAgents() {
            try {
                const response = await fetch('/api/v1/agents');
                const agents = await response.json();
                const agentList = document.getElementById('agentList');
                const html = agents.map(agent => \`
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100" style="cursor: pointer;" onclick="showAgentSales(\${agent.agent_id})">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title mb-0">\${agent.first_name} \${agent.last_name}</h5>
                                    <span class="badge bg-primary">ID: \${agent.agent_id}</span>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <i class="bi bi-envelope me-2"></i>
                                        <a href="mailto:\${agent.email}" class="text-decoration-none">\${agent.email}</a>
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-telephone me-2"></i>
                                        \${agent.phone_number || 'N/A'}
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-geo-alt me-2"></i>
                                        \${agent.address || 'N/A'}
                                    </li>
                                </ul>
                            </div>
                            <div class="card-footer bg-transparent text-center">
                                <small class="text-muted">Click to view sales details</small>
                            </div>
                        </div>
                    </div>
                \`).join('');
                agentList.innerHTML = html;
            } catch (error) {
                console.error('Error loading agents:', error);
                showError('Failed to load agents');
            }
        }

        async function showAgentSales(agentId) {
            try {
                const response = await fetch(\`/api/v1/agents/\${agentId}/sales\`);
                const sales = await response.json();
                const salesDetails = document.getElementById('salesDetails');
                
                if (sales.length === 0) {
                    salesDetails.innerHTML = '<div class="alert alert-info">No sales records found for this agent.</div>';
                } else {
                    const totalPremium = sales.reduce((sum, sale) => sum + Number(sale.premium_amount), 0);
                    salesDetails.innerHTML = \`
                        <div class="mb-4">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <h6 class="card-title">Total Premium Amount</h6>
                                    <h3 class="mb-0">$\${totalPremium.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Policy Number</th>
                                        <th>Premium</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${sales.map(sale => \`
                                        <tr>
                                            <td>\${new Date(sale.sale_date).toLocaleDateString()}</td>
                                            <td>\${sale.product_name}</td>
                                            <td>\${sale.policy_number}</td>
                                            <td>$\${Number(sale.premium_amount).toLocaleString()}</td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        </div>
                    \`;
                }
                salesModal.show();
            } catch (error) {
                console.error('Error loading sales:', error);
                showError('Failed to load sales details');
            }
        }

        async function searchAgent(id) {
            try {
                const response = await fetch(\`/api/v1/agents/\${id}\`);
                if (!response.ok) throw new Error('Agent not found');
                const agent = await response.json();
                const agentList = document.getElementById('agentList');
                agentList.innerHTML = \`
                    <div class="col-md-6 mx-auto">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title mb-0">\${agent.first_name} \${agent.last_name}</h5>
                                    <span class="badge bg-primary">ID: \${agent.agent_id}</span>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <i class="bi bi-envelope me-2"></i>
                                        <a href="mailto:\${agent.email}" class="text-decoration-none">\${agent.email}</a>
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-telephone me-2"></i>
                                        \${agent.phone_number || 'N/A'}
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-geo-alt me-2"></i>
                                        \${agent.address || 'N/A'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                console.error('Error searching agent:', error);
                showError('Agent not found');
            }
        }

        function showError(message) {
            const agentList = document.getElementById('agentList');
            agentList.innerHTML = \`
                <div class="col-12 text-center">
                    <div class="alert alert-danger" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        \${message}
                    </div>
                </div>
            \`;
        }

        loadAllAgents();
        document.getElementById('agentId').addEventListener('input', (e) => {
            const id = e.target.value;
            if (id) searchAgent(id);
            else loadAllAgents();
        });
    </script>
</body>
</html>
` 