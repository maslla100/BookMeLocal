function getDashboardUrl(role) {
    console.log("getDashboardUrl called with at utiljs role:", role); // Add this line
    let dashboardUrl;
    switch (role) {
        case 'admin':
            dashboardUrl = '/admin/adminDashboard';
            break;
        case 'owner':
            dashboardUrl = '/owner/ownerDashboard';
            break;
        case 'customer':
            dashboardUrl = '/customer/customerDashboard';
            break;
        default:
            dashboardUrl = '/';
    }
    console.log("utilsjs redirecting to:", dashboardUrl); // Add this line
    return dashboardUrl;
}

module.exports = {
    getDashboardUrl
};
