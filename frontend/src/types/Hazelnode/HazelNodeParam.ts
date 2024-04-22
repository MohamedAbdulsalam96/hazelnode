
export interface HazelNodeParam{
	name: string
	creation: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Label : Data	*/
	label: string
	/**	Event : Link - Hazel Node Event Type - if left empty, shown for all types of events	*/
	event?: string
	/**	Fieldtype : Select	*/
	fieldtype: "Data" | "Check" | "Number" | "Date" | "Select" | "Link"
	/**	Is Mandatory? : Check	*/
	is_mandatory?: 0 | 1
	/**	Fieldname : Data	*/
	fieldname: string
	/**	Options : Small Text	*/
	options?: string
}
