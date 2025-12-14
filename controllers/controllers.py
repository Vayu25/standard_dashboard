# -*- coding: utf-8 -*-
# from odoo import http


# class CustomJsSalesOrder(http.Controller):
#     @http.route('/custom_js_sales_order/custom_js_sales_order', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/custom_js_sales_order/custom_js_sales_order/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('custom_js_sales_order.listing', {
#             'root': '/custom_js_sales_order/custom_js_sales_order',
#             'objects': http.request.env['custom_js_sales_order.custom_js_sales_order'].search([]),
#         })

#     @http.route('/custom_js_sales_order/custom_js_sales_order/objects/<model("custom_js_sales_order.custom_js_sales_order"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('custom_js_sales_order.object', {
#             'object': obj
#         })

