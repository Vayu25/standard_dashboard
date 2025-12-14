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

        this.interval = setInterval(() => this.loadPurchaseData(), 10000);
        onWillUnmount(() => clearInterval(this.interval));
    }

    async loadLabels() {
        try {
            const fields = await this.orm.call("purchase.order", "fields_get", [["state"]]);
            this.state.purchaseLabels = Object.fromEntries(fields.state.selection);
        } catch (err) {
            console.error("Error fetching Purchase Order labels:", err);
        }
    }

    async loadPurchaseData() {
        try {
            this.state.isLoading = true;
            const groups = await this.orm.call("purchase.order", "read_group", [
                [],
                ["id:count"],
                ["state"],
            ]);
            this.state.purchaseStats = groups.map((item, i) => ({
                key: item.state || `unknown_${i}`,
                label: this.state.purchaseLabels[item.state] || item.state || "Unknown",
                count: item.state_count || item.__count || 0,
            }));
            this.state.lastUpdated = new Date().toLocaleTimeString();
        } catch (err) {
            console.error("Error loading Purchase data:", err);
        } finally {
            this.state.isLoading = false;
        }
    }

    async onClickRefresh() {
        await this.loadPurchaseData();
    }
}

registry.category("actions").add("verts_standard_dashboard.purchase_dashboard_action", PurchaseOrderDashboard);
