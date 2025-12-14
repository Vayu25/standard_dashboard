/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, onWillStart, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class SaleOrderDashboard extends Component {
    static template = "verts_standard_dashboard.SaleOrderDashboard";

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            saleStats: [],
            saleLabels: {},
            isLoading: true,
            lastUpdated: null,
        });

        onWillStart(async () => {
            await this.loadLabels();
            await this.loadSaleData();
        });

        // 🔁 Auto refresh every 10 seconds
        this.interval = setInterval(() => this.loadSaleData(), 10000);
        onWillUnmount(() => clearInterval(this.interval));
    }

    // 🧾 Load Sale Order labels
    async loadLabels() {
        try {
            const saleFields = await this.orm.call("sale.order", "fields_get", [["state"]]);
            this.state.saleLabels = Object.fromEntries(saleFields.state.selection);
        } catch (err) {
            console.error("Error loading sale order field labels:", err);
        }
    }

    // 🚀 Fetch Sale Order stats
    async loadSaleData() {
        try {
            this.state.isLoading = true;

            const saleData = await this.orm.call("sale.order", "read_group", [
                [],
                ["id:count"],
                ["state"],
            ]);

            this.state.saleStats = saleData.map((item, index) => {
                const key = item.state || `unknown_${index}`;
                const label = this.state.saleLabels[item.state] || item.state || "Unknown";
                const count = item.state_count || item.__count || 0;
                return { key, label, count };
            });

            this.state.lastUpdated = new Date().toLocaleTimeString();
        } catch (error) {
            console.error("Error loading sale order dashboard:", error);
        } finally {
            this.state.isLoading = false;
        }
    }

    // 🔄 Manual refresh
    async onClickRefresh() {
        await this.loadSaleData();
    }
}

SaleOrderDashboard.props = {
    action: { type: Object, optional: true },
    actionId: { type: Number, optional: true },
    updateActionState: { type: Function, optional: true },
    className: { type: String, optional: true },
};

// ✅ Register in Odoo registry
registry.category("actions").add("verts_standard_dashboard.sale_dashboard_action", SaleOrderDashboard);
