
export interface HazelNodeEventType{
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
	/**	Title : Data	*/
	title: string
	/**	Node Type : Link - Hazel Node Type	*/
	node_type: string
	/**	Is Standard? : Check	*/
	is_standard?: 0 | 1
}
