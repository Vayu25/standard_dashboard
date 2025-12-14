# -*- coding: utf-8 -*-
{
    "name": "custom_js_sales_order",
    "summary": "Custom JS + HTML Sale Order List View (Odoo 18)",
    "description": """
This module creates a fully custom Sale Order List View using Owl (JS + HTML)
without using Odoo’s standard ListView or Controller.
    """,
    "author": "Praveen Yadav",
    "website": "https://www.yourcompany.com",
    "category": "Sales",
    "version": "1.0",
    "depends": ["base", "web", "sale","purchase"],

    # only backend model/view records go here
    "data": [
        # "views/templates.xml",
        "views/menu_views.xml",
    ],

    # frontend templates and JS assets
    "assets": {
        "web.assets_backend": [
            "/verts_standard_dashboard/static/src/js/sale_order_custom_view.js",
            "/verts_standard_dashboard/static/src/xml/template.xml",
            "/verts_standard_dashboard/static/src/js/sale_order_dashboard.js",
            "/verts_standard_dashboard/static/src/xml/sale_order_dashboard.xml",
            "/verts_standard_dashboard/static/src/js/purchase_order_daskboard.js",
            "/verts_standard_dashboard/static/src/xml/Purchase_order_daskboard.xml",
        ],
    },

    "installable": True,
    "application": True,
}
