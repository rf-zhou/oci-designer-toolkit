#!/usr/bin/python

# Copyright (c) 2021, Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

"""Provide Module Description
"""

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
__author__ = ["Andrew Hopkinson (Oracle Cloud Solutions A-Team)"]
__version__ = "1.0.0"
__module__ = "ociAnalytics"
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#


import oci

from common.okitLogging import getLogger
from facades.ociConnection import OCIAnalyticsConnection

# Configure logging
logger = getLogger()


class OCIAnalyticss(OCIAnalyticsConnection):
    def __init__(self, config=None, configfile=None, profile=None, compartment_id=None):
        self.compartment_id = compartment_id
        self.analyticss_json = []
        super(OCIAnalyticss, self).__init__(config=config, configfile=configfile, profile=profile)

    def list(self, compartment_id=None, filter=None):
        if compartment_id is None:
            compartment_id = self.compartment_id

        # Add filter to only return AVAILABLE Compartments
        if filter is None:
            filter = {}

        if 'lifecycle_state' not in filter:
            filter['lifecycle_state'] = 'AVAILABLE'

        analyticss = oci.pagination.list_call_get_all_results(self.client.list_analyticss, compartment_id=compartment_id).data

        # Convert to Json object
        analyticss_json = self.toJson(analyticss)
        logger.debug(str(analyticss_json))

        # Filter results
        self.analyticss_json = self.filterJsonObjectList(analyticss_json, filter)
        logger.debug(str(self.analyticss_json))

        return self.analyticss_json
