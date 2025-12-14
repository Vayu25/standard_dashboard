/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, onWillStart, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class PurchaseOrderDashboard extends Component {
    static template = "verts_standard_dashboard.PurchaseOrderDashboard";

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            purchaseStats: [],
            purchaseLabels: {},
            isLoading: true,
            lastUpdated: null,
        });

        onWillStart(async () => {
            await this.loadLabels();
            await this.loadPurchaseData();
        });

        // 🔁 Auto refresh every 10 seconds
        this.interval = setInterval(() => this.loadPurchaseData(), 10000);
        onWillUnmount(() => clearInterval(this.interval));
    }

    // 🧾 Load Purchase Order labels
    async loadLabels() {
        try {
            const purchaseFields = await this.orm.call("purchase.order", "fields_get", [["state"]]);
            this.state.purchaseLabels = Object.fromEntries(purchaseFields.state.selection);
        } catch (err) {
            console.error("Error loading purchase order field labels:", err);
        }
    }

    // 🚀 Fetch Purchase Order stats
    async loadPurchaseData() {
        try {
            this.state.isLoading = true;

            const purchaseData = await this.orm.call("purchase.order", "read_group", [
                [],
                ["id:count"],
                ["state"],
            ]);

            this.state.purchaseStats = purchaseData.map((item, index) => {
                const key = item.state || `unknown_${index}`;
                const label = this.state.purchaseLabels[item.state] || item.state || "Unknown";
                const count = item.state_count || item.__count || 0;
                return { key, label, count };
            });

            this.state.lastUpdated = new Date().toLocaleTimeString();
        } catch (error) {
            console.error("Error loading purchase order dashboard:", error);
        } finally {
            this.state.isLoading = false;
        }
    }

    // 🔄 Manual refresh
    async onClickRefresh() {
        await this.loadPurchaseData();
    }
}

PurchaseOrderDashboard.props = {
    action: { type: Object, optional: true },
    actionId: { type: Number, optional: true },
    updateActionState: { type: Function, optional: true },
    className: { type: String, optional: true },
};

// ✅ Register in Odoo registry
registry.category("actions").add("verts_standard_dashboard.purchase_dashboard_action", PurchaseOrderDashboard);
