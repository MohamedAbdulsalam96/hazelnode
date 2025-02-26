# Copyright (c) 2024, Build With Hussain and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class HazelNodeParam(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		event: DF.Link | None
		fieldname: DF.Data
		fieldtype: DF.Literal[
			'Data', 'Check', 'Number', 'Date', 'Select', 'Link'
		]
		is_computed: DF.Check
		is_mandatory: DF.Check
		label: DF.Data
		options: DF.SmallText | None
		parent: DFf.Data
		parentfield: DF.Data
		parenttype: DF.Data
	# end: auto-generated types

	pass
