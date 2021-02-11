/*
** Copyright (c) 2021, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Analytics View Javascript');

/*
** Define Analytics View Class
*/
class AnalyticsView extends OkitArtefactView {
    constructor(artefact=null, json_view) {
        super(artefact, json_view);
    }
    // TODO: Analytics - Modified From Generated
    get parent_id() {
        let primary_subnet = this.getJsonView().getSubnet(this.subnet_id);
        if (primary_subnet && primary_subnet.compartment_id === this.artefact.compartment_id) {
            return this.subnet_id;
        } else {
            return this.compartment_id;
        }
    }
    // TODO: Analytics - Modified From Generated
    get parent() {return this.getJsonView().getSubnet(this.parent_id) ? this.getJsonView().getSubnet(this.parent_id) : this.getJsonView().getCompartment(this.parent_id);}
    // TODO: If the Resource is within a Subnet but the subnet_iss is not at the top level then raise it with the following functions if not required delete them.
    // Direct Subnet Access
    get subnet_id() {return this.artefact.network_endpoint_details.subnet_id;}
    set subnet_id(id) {this.artefact.network_endpoint_details.subnet_id = id;}
    /*
    ** SVG Processing
    */
    /*
    ** Property Sheet Load function
    */
    loadProperties() {
        const self = this;
        $(jqId(PROPERTIES_PANEL)).load("propertysheets/analytics.html", () => {loadPropertiesSheet(self.artefact);});
    }
    /*
    ** Load and display Value Proposition
    */
    loadValueProposition() {
        $(jqId(VALUE_PROPOSITION_PANEL)).load("valueproposition/analytics.html");
    }
    /*
    ** Static Functionality
    */
    static getArtifactReference() {
        return Analytics.getArtifactReference();
    }
    static getDropTargets() {
        // TODO: Analytics - Modified From Generated
        return [Subnet.getArtifactReference(), Compartment.getArtifactReference()];
    }
}
/*
** Dynamically Add View Functions
*/
OkitJsonView.prototype.dropAnalyticsView = function(target) {
    let view_artefact = this.newAnalytics();
    if (target.type === Compartment.getArtifactReference()) {
        view_artefact.artefact.compartment_id = target.id;
    } else {
        view_artefact.artefact.compartment_id = target.compartment_id;
    }
    view_artefact.recalculate_dimensions = true;
    return view_artefact;
}
OkitJsonView.prototype.newAnalytics = function(obj) {
    this.getAnalyticss().push(obj ? new AnalyticsView(obj, this) : new AnalyticsView(this.okitjson.newAnalytics(), this));
    return this.getAnalyticss()[this.getAnalyticss().length - 1];
}
OkitJsonView.prototype.getAnalyticss = function() {
    if (!this.analyticss) {
        this.analyticss = [];
    }
    return this.analyticss;
}
OkitJsonView.prototype.getAnalytics = function(id='') {
    for (let artefact of this.getAnalyticss()) {
        if (artefact.id === id) {
            return artefact;
        }
    }
    return undefined;
}
OkitJsonView.prototype.loadAnalyticss = function(analyticss) {
    for (const artefact of analyticss) {
        this.getAnalyticss().push(new AnalyticsView(new Analytics(artefact, this.okitjson), this));
    }
}
OkitJsonView.prototype.moveAnalytics = function(id) {
    // Build Dialog
    const self = this;
    let analytics = this.getAnalytics(id);
    $(jqId('modal_dialog_title')).text('Move ' + analytics.display_name);
    $(jqId('modal_dialog_body')).empty();
    $(jqId('modal_dialog_footer')).empty();
    const table = d3.select(d3Id('modal_dialog_body')).append('div')
        .attr('class', 'table okit-table');
    const tbody = table.append('div')
        .attr('class', 'tbody');
    // Subnet
    let tr = tbody.append('div')
        .attr('class', 'tr');
    tr.append('div')
        .attr('class', 'td')
        .text('Subnet');
    tr.append('div')
        .attr('class', 'td')
        .append('select')
        .attr('id', 'move_analytics_subnet_id');
    // Load Subnets
    this.loadSubnetsSelect('move_analytics_subnet_id');
    $(jqId("move_analytics_subnet_id")).val(analytics.artefact.subnet_id);
    // Submit Button
    const submit = d3.select(d3Id('modal_dialog_footer')).append('div').append('button')
        .attr('id', 'submit_query_btn')
        .attr('type', 'button')
        .text('Move')
        .on('click', function () {
            $(jqId('modal_dialog_wrapper')).addClass('hidden');
            if (analytics.artefact.subnet_id !== $(jqId("move_analytics_subnet_id")).val()) {
                self.getSubnet(analytics.artefact.subnet_id).recalculate_dimensions = true;
                self.getSubnet($(jqId("move_analytics_subnet_id")).val()).recalculate_dimensions = true;
                analytics.artefact.subnet_id = $(jqId("move_analytics_subnet_id")).val();
                analytics.artefact.compartment_id = self.getSubnet(analytics.artefact.subnet_id).artefact.compartment_id;
            }
            self.update(this.okitjson);
        });
    $(jqId('modal_dialog_wrapper')).removeClass('hidden');
}
OkitJsonView.prototype.pasteAnalytics = function(drop_target) {
    const clone = this.copied_artefact.artefact.clone();
    clone.display_name += 'Copy';
    if (this.paste_count) {clone.display_name += `-${this.paste_count}`;}
    this.paste_count += 1;
    clone.id = clone.okit_id;
    if (drop_target.getArtifactReference() === Subnet.getArtifactReference()) {
        clone.subnet_id = drop_target.id;
        clone.compartment_id = drop_target.compartment_id;
    }
    this.okitjson.analyticss.push(clone);
    this.update(this.okitjson);
}
OkitJsonView.prototype.loadAnalyticssSelect = function(select_id, empty_option=false) {
    $(jqId(select_id)).empty();
    const analytics_select = $(jqId(select_id));
    if (empty_option) {
        analytics_select.append($('<option>').attr('value', '').text(''));
    }
    for (let analytics of this.getAnalyticss()) {
        analytics_select.append($('<option>').attr('value', analytics.id).text(analytics.display_name));
    }
}
OkitJsonView.prototype.loadAnalyticssMultiSelect = function(select_id) {
    $(jqId(select_id)).empty();
    const multi_select = d3.select(d3Id(select_id));
    for (let analytics of this.getAnalyticss()) {
        const div = multi_select.append('div');
        div.append('input')
            .attr('type', 'checkbox')
            .attr('id', safeId(analytics.id))
            .attr('value', analytics.id);
        div.append('label')
            .attr('for', safeId(analytics.id))
            .text(analytics.display_name);
    }
}
