module.exports = Object.freeze({
    SERVICE_URLS: {
      ABAP: {
        BASE_PATH: "sap/opu/odata/sap/",
        MASS_UPLOAD: {
          DESCRIPTION: "Service for receiving Mass Upload data",
          URL: "ZMM_SB_MASS_UPLOAD",
          PATHS: {
            MassUploadItems: "MassUploadItems"
          }
        },
        PROJECT: {
          DESCRIPTION: "Service for receiving Project Request data",
          URL: "ZMM_SB_PREQ_UI_V2/",
          PATHS: {
            Object: "object"
          }
        },
        SPIR: {
          DESCRIPTION: "Service for receiving SPIR Request data",
          URL: "ZMM_SB_SPIR_REQUEST/",
          PATHS: {
            Ainfo: "Ainfo",
            Equipment: "Equipment",
            Header: "Header",
            Info: "Info",
            Mat: "Mat",
            Object: "Object",
            Rec_Doc: "Rec_Doc",
            Req_Doc: "Req_Doc",
            SpareParts: "SpareParts",
            SpareParts_Source: "SpareParts_Source"
          }
        },
        PREQ_ERRORS: {
          URL: "ZMM_SB_VALID_ERROR_PREQ/",
          PATHS: {
            VALID_ERR_PREQ: "ValidErrPreq"
          }
        },
        SREQ_ERRORS: {
          URL: "ZMM_SB_VALID_ERROR_SREQ/",
          PATHS: {
            VALID_ERR_SREQ: "ValidErrSreq"
          }
        }
      },
      AIN: {
        BASE_PATH: "https://ain-live.cfapps.eu10.hana.ondemand.com/ain/services/api/v1/",
        DEFAULT_DESTINATION: "AIN_JWT",
        EQUIPMENT: {
          DESCRIPTION: "It will return list of all the equipment if the user at least has READ privilege.",
          URL: "equipment"
        },
        INVITEES: {
          DESCRIPTION: "Retrieves information about the invitees company profile. User should atleast have COMPANYPROFILE_READ role.",
          URL: "company/profile/invitees"
        },
        SUBSIDIARIES: {
          DESCRIPTION: "Retrieves information about a subsidiaries company profile. User should atleast have COMPANYPROFILE_READ role.",
          URL: "company/profile({orgId})/subsidiaries"
        },
        EXTERNAL_ORGANIZATIONS: {
          DESCRIPTION: "This endpoint allows you to get all external organizations associated with logged in organization. User atleast needs COMPANYPROFILE_READ role.",
          URL: "company/profile/externalorg"
        },
        COMPANY_PROFILE: {
          DESCRIPTION: "Retrieves information about the company profile. User should atleast have COMPANYPROFILE_READ role.",
          URL: "company/profile({orgId})"
        },
        GROUPS: {
          DESCRIPTION: "Get and edit list of all groups known to the user account",
          URL: "groups"
        },
        GROUPS_ASSIGN: {
          DESCRIPTION: "This endpoint allows to add business objects to a group.",
          URL: "groups/{groupId}/assign"
        },
        GROUPS_ASSIGNED_OBJECTS: {
          DESCRIPTION: "This endpoint allows to see all the valid business objects for a group.",
          URL: "groups/{groupId}/businessobjects"
        },
        GROUPS_DISSOCIATE: {
          DESCRIPTION: "This endpoint allows to delete business objects from a group.",
          URL: "groups/{groupId}/dissociate"
        },
        GROUPS_PUBLISH: {
          DESCRIPTION: "This endpoint allows to publish groups.",
          URL: "groups/publish"
        },
        GROUPS_REVISE: {
          DESCRIPTION: "This endpoint allows to create a new revision of a group.",
          URL: "groups/{groupId}/revise"
        },
        EXTERNAL_SYSTEMS: {
          DESCRIPTION: "This endpoint gets all the external systems configured for the logged on client",
          URL: "external/systems"
        },
        AIN_OBJECTS: {
          DESCRIPTION: "This endpoint gets all the associated internal objects for specified external ID. Use this service to pass the ID as config ID in payload while updating or deleting the external ID maintained for an internal object.",
          URL: "objectsid/ainobjects({ID})"
        },
        EXTERNAL_IDS: {
          DESCRIPTION: "This endpoint allows to maintain an external ID for an internal object in one or more configured external systems",
          URL: "object/externalids"
        },
        EXTERNAL_IDS_DELETE: {
          DESCRIPTION: "This endpoint allows to maintain an external ID for an internal object in one or more configured external systems",
          URL: "object/externalid/delete"
        },
        AUTH_GROUPS: {
          DESCRIPTION: "Retrieves all the authorization groups based on query parameters and filters. User should atleast have SHARING_READ role.",
          URL: "authorization/groups"
        },
        AUTH_GROUPS_MEMBERS: {
          DESCRIPTION: "Adds/removes business partners from an authorization group. User needs to pass business partner ID and value of the operation that needs to be performed. User should atleast have SHARING_EDIT role.",
          URL: "authorization/groups({authGroupId})/members"
        },
        AUTH_GROUP_DEPENDENCIES: {
          DESCRIPTION: "Reads dependent objects of the given object ID in the payload that can be shared with the given authorization group ID.User should atleast have SHARING_EDIT or AIN_STANDARDS role.",
          URL: "authorization/groups({authGroupId})/objects/dependencies"
        },
        AUTH_GROUP_OBJECTS: {
          DESCRIPTION: "Updates objects that belongs to an authorization group for the specified group ID. User should atleast have SHARING_EDIT or AIN_STANDARDS role.",
          URL: "authorization/groups({authGroupId})/objects"
        },
        UNITS_STRUCTURE: {
          DESCRIPTION: "This endpoint allows you to retreive organizational unit structure. User should have at least USER_AUTH_READ or USER_AUTH_EDIT role assigined.",
          URL: "user-auth/organization/units/structure"
        },
        OBJECT_EXTERNAL_ID: {
          DESCRIPTION: "This endpoint gets all the associated external ID configurations in different external systems for an internal object ID. Use this service to pass the ID as config ID in payload while updating or deleting the external ID maintained for an internal object.",
          URL: "objectid/externalid({objectId})"
        },
        USERS: {
          DESCRIPTION: "Retrieves users and their invitees from the organization to which you have logged on. User should atleast have CONFIGURATION_EDIT role.",
          URL: "company/users"
        },
        USER_OBJECTS: {
          DESCRIPTION: "Updates organization unit by adding/removing business objects to an organization unit. User should have at least USER_AUTH_DELETE or USER_AUTH_EDIT role assigned.",
          URL: "user-auth/organization/units({unitID})/objects"
        },
        USER_OBJECTS_DEPENDENCIES: {
          DESCRIPTION: "Updates organization unit by adding/removing business objects to an organization unit. User should have at least USER_AUTH_DELETE or USER_AUTH_EDIT role assigned.",
          URL: "user-auth/organization/units/objects/dependencies"
        },
        LOCATION: {
          DESCRIPTION: "Retrieves locations based on filter query parameter. User should at least have READ privilege.",
          URL: "location({locationId})"
        },
        LOCATION_COMPONENTS: {
          DESCRIPTION: "Updates list of location components (or hierarchy) for the specified location. User should at least have WRITE privilege.",
          URL: "location({locationId})/components"
        },
        LOCATION_REVISE: {
          DESCRIPTION: "Changes the status of a specific location to InRevision. User should at least have EDIT privilege.",
          URL: "location({locationId})/revise"
        },
        LOCATION_PUBLISH: {
          DESCRIPTION: "Changes status to publish for the list of location that you have specified. User should at least have EDIT privilege.",
          URL: "location({locationId})/publish"
        },
        LOCATION_TEMPLATES: {
          DESCRIPTION: "Retrieves the templates of the location with specified location ID. User should at least have READ privilege.",
          URL: "location({locationId})/templates"
        },
        LOCATION_TEMPLATE_VALUES: {
          DESCRIPTION: "Retrieves the location characteristics/attribute values for specific location. For example - /location({id})/values?status=1 or 2 or 3, where 1 = Unpublished 2 = Published 3 = In Revision. User should at least have READ privilege.",
          URL: "location({locationId})/values"
        },
        EQUIPMENT_HEADER: {
          DESCRIPTION: "Retrieves equipment header information based on the specified equipment ID. User should have at least have READ privilege for this equipment.",
          URL: "equipment({equipmentId})/header"
        },
        EQUIPMENT_TEMPLATES: {
          DESCRIPTION: "Retrieves the templates of the equipment with specified equipment ID. User should at least have READ privilege.",
          URL: "equipment({equipmentId})/templates"
        },
        EQUIPMENT_TEMPLATE_VALUES: {
          DESCRIPTION: "Retrieves the equipment characteristics/attribute values for specific equipment. User should at least have READ privilege.",
          URL: "equipment({equipmentId})/values"
        },
        SPARE_PART: {
          DESCRIPTION: "Retrieves spare part header information based on the specified spare part ID. User should have at least have READ privilege for this spare part.",
          URL: "parts({partId})"
        },
        SPARE_PART_TEMPLATES: {
          DESCRIPTION: "Retrieves the templates of the spare part with specified spare part ID. User should at least have READ privilege.",
          URL: "parts({partId})/templates"
        },
        SPARE_PART_TEMPLATE_VALUES: {
          DESCRIPTION: "Retrieves the spare part characteristics/attribute values for specific spare part. User should at least have READ privilege.",
          URL: "parts({partId})/values"
        },
              ORGANIZATION_BY_ROLE: {
                  DESCRIPTION: "Retrieves all the organizations present based on their role. User should atleast have COMPANYPROFILE_READ role.",
                  URL: "organizations/byrole?roleid={ID}"
              },
        COMPOSITE_API: {
          DESCRIPTION: "This API generates a new composite request.",
          URL: "composites"
        }
      },
      WF: {
        BASE_PATH: "/",
        MESSAGES: {
          DESCRIPTION: "Endpoint that waits result at workflow",
          URL: "v1/messages"
        }
      }
    },
    ADNOC_COMPANY_NAME: "ADNOC",
    NETWORK_SHARING_GROUP_WITH_ADNOC: "toADNOC",
    //1 - Project team, 2 - Cataloguing team, 3 - Maintenance Team, 4 - Inventory Team
    REVIEW_TEAM_ACTION_MAP: {
      "sreq_setToApproved_PrT": {
        CURRENT_TEAM: "1",
        NEXT_TEAM: "2",
      }, 
      "sreq_setToApproved_CtT": {
        CURRENT_TEAM: "2",
        NEXT_TEAM: "3",
      }, 
      "sreq_setToApproved_MnT": {
        CURRENT_TEAM: "3",
        NEXT_TEAM: "4",
      },
  
      "sreq_sendToProjectTeamForUpdate": {
        PREVIOUS_TEAM: "1",
        CURRENT_TEAM: "2"
      },
      "sreq_sendToCataloguingTeamForUpdate": {
        PREVIOUS_TEAM: "2",
        CURRENT_TEAM: "3"
      },
      "sreq_sendToMaintenanceTeamForUpdate": {
        PREVIOUS_TEAM: "3",
        CURRENT_TEAM: "4"
      },
    },
    OBJECT_STRUCTURE_OBJECT_TYPE: {
      EQUIPMENT: "EQU",
      SPARE_PART: "PRT",
      LOCATION: "FL"
    },
    SPIR_ERROR_OBJECT_TYPE: {
      EQUIPMENT: "EQU",
      SPARE_PART: "SPT"
    },
    ERROR_TYPES: {
      ERROR: 0,
      WARNING: 1,
      INFO: 2,
      SUCCESS: 3
    },
    ATTRIBUTE_OPTION: {
      MANDATORY: "2",
      RECOMMENDED: "1",
      OPTIONAL: "0"
    },
    LOCATION_ID_MASK: {
      "ADNOC": "X-XX-XXXX-XXXX-SSSSSSSSSSSSSSSSSSSSSSSSS",
      "A-SUB": "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
    },
    LOCATION_ID_MASK_CHAR_MAP: {
      "-": "-",
      "X": "[A-Za-z0-9]",
      "S": "[A-Za-z0-9&()+.,/:;<=]"
    },
    MASTER_LOCATION_TEMPLATE_TO_VALIDATE: "adnoc.location.master",
    MASTER_EQUIPMENT_TEMPLATE_TO_VALIDATE: "adnoc.equipment.master",
    MASTER_SPARE_PART_TEMPLATE_TO_VALIDATE: "adnoc.sparepart.master",
    STRUCTURAL_INDICATOR_ATTRIBUTE_NAME: "adnoc.structureIndicator",
    ROLES: [{
      code: 1,
      description: "REQUESTER"
    },{
      code: 2,
      description: "PROVIDER"
    },{
      code: 3,
      description: "REVIEWER"
    }],
    TEAMS: {
      PROJECT_TEAM: "1",
      CATALOGUING_TEAM: "2",
      MAINTENANCE_TEAM: "3",
      INVENTORY_TEAM: "4"
    },
    DEFAULT_COMPOSITE_METHODS: {
      CREATE: "POST",
      READ: "GET",
      UPDATE: "PUT",
      DELETE: "DELETE"
    },
    DEFAULT_METHODS: {
        ADD: "POST",
        READ: "GET",
        UPDATE: "PUT",
        DELETE: "DELETE"
      },
    MAX_COMPOSITE_REQUESTS_COUNT: 50,
    ORGANIZATION_ROLES: [{
        code: "MANUFACTURER",
        key: 1
      }, {
        code: "SERVICE PROVIDER",
        key: 2
      }, {
        code: "OPERATOR",
        key: 3
      }, {
        code: "SUPPLIER",
        key: 4
      }, {
        code: "DEALER",
        key: 4
       }, {
        code: "INSURER",
        key: 5
      }, {
        code: "REGULATOR AUTHORITY",
        key: 6
      }, {
        code: "SOFTWARE PARTNER",
        key: 7
      }, {
        code: "CONTENT PARTNER",
        key: 7
      }, {
        code: "RETAILER",
        key: 8
      }
    ],
    APPS: {
      SREQ: "sreq",
      PREQ: "preq"
    },
    DESTINATIONS: {
      AIN_JWT: {
        DESCRIPTION: "",
        ID: "AIN_JWT"
      },
      AIN_CC: {
        DESCRIPTION: "",
        ID: "AIN_CC"
      },
      AC_JWT: {
        DESCRIPTION: "",
        ID: "AC_JWT"
      },
      AC_CC: {
        DESCRIPTION: "",
        ID: "AC_CC"
      },
      ABAP: {
        DESCRIPTION: "",
        ID: "abapdest"
      }
    }
  });