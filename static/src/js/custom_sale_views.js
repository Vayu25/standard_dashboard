/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class CustomSaleList extends Component {
    static template = "verts_standard_dashboard.ListView";
    static props = {
        action: { type: Object, optional: true },
        actionId: { type: Number, optional: true },
        updateActionState: { type: Function, optional: true },
        className: { type: String, optional: true },
    };
    setup() {
        this.orm = useService("orm");
        this.state = useState({ records: [] });

        // Before component loads, fetch data
        onWillStart(async () => {
            const records = await this.orm.searchRead(
                "sale.order",
                [],
                ["name", "partner_id", "date_order", "amount_total"]
            );
            this.state.records = records;
        });
    }
}
CustomSaleList.template = "verts_standard_dashboard.ListView";

// Register this view in Odoo web client
registry.category("actions").add("verts_standard_dashboard.action", CustomSaleList);
