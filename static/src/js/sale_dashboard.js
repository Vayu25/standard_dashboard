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

        this.interval = setInterval(() => this.loadSaleData(), 10000);
        onWillUnmount(() => clearInterval(this.interval));
    }

    async loadLabels() {
        try {
            const fields = await this.orm.call("sale.order", "fields_get", [["state"]]);
            this.state.saleLabels = Object.fromEntries(fields.state.selection);
        } catch (err) {
            console.error("Error fetching Sale Order labels:", err);
        }
    }

    async loadSaleData() {
        try {
            this.state.isLoading = true;
            const groups = await this.orm.call("sale.order", "read_group", [
                [],
                ["id:count"],
                ["state"],
            ]);
            this.state.saleStats = groups.map((item, i) => ({
                key: item.state || `unknown_${i}`,
                label: this.state.saleLabels[item.state] || item.state || "Unknown",
                count: item.state_count || item.__count || 0,
            }));
            this.state.lastUpdated = new Date().toLocaleTimeString();
        } catch (err) {
            console.error("Error loading Sale data:", err);
        } finally {
            this.state.isLoading = false;
        }
    }

    async onClickRefresh() {
        await this.loadSaleData();
    }
}

registry.category("actions").add("verts_standard_dashboard.sale_dashboard_action", SaleOrderDashboard);
