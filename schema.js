const LocHeader = {
    excelitemID: {
      prop: "excelitemID",
      type: String,
      description: "User specified Id."
    },
    method: {
      prop: "method",
      type: String,
      description: "Upload Method for the Item."
    },
    internalID: {
      prop: "internalID",
      type: String,
      maxLength: 256,
      description:
      "The source business partner role of the equipment. Possible values are 1 - For my operations, 2 - For Service and 3 - For Customer. Use /enumeration API with the type as 'SourceBPRole' to get the enumeration."
    },
    "description.short": {
      prop: "description_short",
      type: String,
      maxLength: 255,
      description: "Short description."
    },
    "description.long": {
      prop: "description_long",
      type: String,
      maxLength: 5000,
      description: "Long description."
    },
    "adnoc.objectType": {
      prop: "adnoc_objectType",
      type: String,
      maxLength: 10,
      description: "Technical Object Type."
    },
    "adnoc.startupDate": {
      prop: "adnoc_StartupDate",
      type: String,
      format: "YYYY-MM-DD",
      description: "Adnoc Startup Date as string format : YYYY-MM-DD."
    },
    "adnoc.hdt.maintenancePlant": {
      prop: "adnoc_hdt_maintenancePlant",
      type: String,
      maxLength: 4,
      description: "Maintenance Plant."
    },
    "adnoc.hdt.plantSection": {
      prop: "adnoc_hdt_plantSection",
      type: String,
      maxLength: 4,
      description: "Plant Section."
    },
    "adnoc.hdt.plantLocation": {
      prop: "adnoc_hdt_plantLocation",
      type: String,
      maxLength: 10,
      description: "Plant Location."
    },
    "adnoc.hdt.hsecesCategory1": {
      prop: "adnoc_hdt_hsecesCategory1",
      type: String,
      maxLength: 8,
      description: "HSECES Category 1."
    },
    "adnoc.hdt.criticalityCode": {
      prop: "adnoc_hdt_criticalityCode",
      type: String,
      maxLength: 10,
      description: "Criticality."
    },
    "adnoc.hdt.sortField": {
      prop: "adnoc_hdt_sortField",
      type: String,
      maxLength: 30,
      description: "Sort Field."
    },
    "adnoc.hdt.maintenancePlanningPlant": {
      prop: "adnoc_hdt_maintenancePlanningPlant",
      type: String,
      maxLength: 10,
      description: "Maintenance Planning Plant."
    },
    "adnoc.hdt.plannerGroup": {
      prop: "adnoc_hdt_plannerGroup",
      type: String,
      maxLength: 3,
      description: "Planner Group."
    },
    "adnoc.hdt.mainWorkCenter": {
      prop: "adnoc_hdt_mainWorkCenter",
      type: String,
      maxLength: 3,
      description: "Main Work Center."
    },
    "adnoc.hdt.catalogProfile": {
      prop: "adnoc_hdt_catalogProfile",
      type: String,
      maxLength: 9,
      description: "Catalog Profile."
    },
    parentId: {
      prop: "parentId",
      type: String,
      maxLength: 32,
      description: "Parent Location."
    },
    "adnoc.position": {
      prop: "adnoc_position",
      type: String,
      maxLength: 4,
      description: "Position."
    }
  };

  const LocComponents = {
    excelitemID: {
      prop: "excelitemID",
      type: String,
      description: "User specified Id."
    },
    method: {
      prop: "method",
      type: String,
      description: "Upload Method for the Item."
    },
    parentID: {
      prop: "parentID",
      type: String,
      maxLength: 256,
    },
    internalID: {
      prop: "internalID",
      type: String,
      maxLength: 256,
    }
  };

  exports.LocHeader = LocHeader;
  exports.LocComponents = LocComponents;