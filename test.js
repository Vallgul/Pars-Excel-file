const axios = require("axios");
const XLSX = require("xlsx");
const Constants = require('./Constants');
const SERVICE_URLS = Constants.SERVICE_URLS;
const DEFAULT_METHODS = Constants.DEFAULT_METHODS;
const fs = require("fs");

var filePath = "./mass_upload_locations.xlsx";

const locationTemplateName = 'adnoc.location.master' // Поменять equipment на location
const locationAttributeGroupName = 'adnoc.location.master' // Поменять equipment на location
const locationAttributes = ['adnoc.objectType','adnoc.startupDate','adnoc.hdt.maintenancePlant','adnoc.hdt.plantSection','adnoc.hdt.plantLocation', //Изменить атрибуты под location
'adnoc.hdt.hsecesCategory1','adnoc.hdt.criticalityCode','adnoc.hdt.sortField','adnoc.hdt.maintenancePlanningPlant',
'adnoc.hdt.plannerGroup','adnoc.hdt.mainWorkCenter','adnoc.hdt.catalogProfile','adnoc.position'];

var operatorID = "8F6077AC16B346E6A90CE8C983CFC6BD";
var attributeKeysArray = {}, logs = {};


module.exports.index = async function () {

    var accessToken = await getToken();  //Получаем token как в постмане
    var workbook = XLSX.readFile(filePath);
    var sheetNameList = workbook.SheetNames; // Массив с именами страниц
    
    //For development only
    fs.appendFileSync("logs.txt", "///Logs recording started///");
    
    //Check which excel template are in use
    if (sheetNameList[0] == "LocHeader"){
      
      templateId = await getTemplateKey(locationTemplateName, accessToken); //Получаем adnoc.location.master ID для templates
      attributeGroupId = await getAttributeGroupKey(locationAttributeGroupName, accessToken); //Получаем adnoc.location.master ID для AttributeGroup
      for (var attribute of locationAttributes){
        attributeId = await getAttributeKey(attribute, accessToken);
        if(attribute == "adnoc.objectType" || attribute == "adnoc.startupDate" || attribute == "adnoc.position"){
          resAttribute = attribute.slice(6); //slice убирает шесть символов перед записью (adnoc.)
        } else { resAttribute = attribute.slice(10); } //slice убирает десять символов перед записью (adnoc.hdt.)
        
        attributeKeysArray[resAttribute] = attributeId;
      }
    
     var dataLocHeader = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]); //Считывает первую страницу построчно
     for (row in dataLocHeader) {  //Берет по одной строке из массива строк, начиная с пятой строки
          if (row > 3) {
    
             if (dataLocHeader[row]['method'] == "add"){
    
              if(dataLocHeader[row]['parentId'] != undefined && dataLocHeader[row]['parentId'] != null)
              {
                parentId = await getParentIdKey(dataLocHeader[row]['parentId'], accessToken); //Вызывается функция для получения 16-ричного ключа по имени parendId. Это нужно для создания нового location, в новый location должен передоваться ключ, а не имя
              }
              method = dataLocHeader[row]['method'];
              URL = SERVICE_URLS.AIN.BASE_PATH + 'location';
              payloadLocationsMain = await prepareLocHeaderPayload(dataLocHeader[row]); //Формируется json для последующей передачи его в body
              resInsertLocationsMain = await handleOperation(method, URL, payloadLocationsMain, accessToken); //Запрос на создание нового location
              console.log(payloadLocationsMain)
    
              // if (resInsertLocationsMain.status == 200){
              locationID = resInsertLocationsMain.data.functionalLocationID; //Достаем location ID, нужно для обновления записи по ID
              method = "update";
              URL_ATTRIBUTE = SERVICE_URLS.AIN.BASE_PATH + 'location(' + locationID + ')/values'
              //URL_TEMPLATE = SERVICE_URLS.AIN.BASE_PATH + 'location/templates'
              // payloadTemplates = await prepareLocTemplatesPayload(); //Сначало нужно добавить template а уже потом добавлять атрибуты, то есть разделяем на два запроса, один запрос не работает
              // resTemplatesUpdate = await handleOperation(method, URL_TEMPLATE, payloadTemplates, accessToken);
              payloadAttributes = await prepareLocAttributesPayload(dataLocHeader[row]);
              resValuesUpdate = await handleOperation(method, URL_ATTRIBUTE, payloadAttributes, accessToken);
              // };
    
              resErrorHadling = await handleError(dataLocHeader[row], resValuesUpdate); 
    
              // if(resValuesUpdate != undefined){
              // statusCode = resInsert.status + ' ' + resValuesUpdate.status;
              // } else {statusCode = resInsert.status;}
              
              // logs[data[i]['excelitemID']] = statusCode;
    
            }
    
            if (dataLocHeader[row]['method'] == "update" ){ //Не работает Location Update
    
              locationID = await getLocationKey(dataLocHeader[row]['internalID'], accessToken);
              // if(dataLocHeader[row]['parentId'] != undefined && dataLocHeader[row]['parentId'] != null)
              // {
              //   parentId = await getParentIdKey(dataLocHeader[row]['parentId'], accessToken); //Вызывается функция для получения 16-ричного ключа по имени parendId. Это нужно для создания нового location, в новый location должен передоваться ключ, а не имя
              // }
              method = dataLocHeader[row]['method'];
              URL = SERVICE_URLS.AIN.BASE_PATH + 'location';
              payload = await prepareLocHeaderPayloadForUpdate(dataLocHeader[row]);
              resUpdate = await handleOperation(method, URL, payload, accessToken);
    
              URL = SERVICE_URLS.AIN.BASE_PATH + 'location(' + locationID + ')/values'
              payloadAttributes = await prepareLocAttributesPayload(dataLocHeader[row]);
              resValuesUpdate = await handleOperation(method, URL, payloadAttributes, accessToken);
              // statusCode = resUpdate.status  + ' ' + resUpdate.statusText + ' ' + resValuesUpdate.status + ' ' + resUpdate.statusText;
    
              resErrorHadling = await handleError(dataLocHeader[row], resValuesUpdate);
    
            }
    
            if ( dataLocHeader[row]['method'] == "delete" ){
              locationID = await getLocationKey(dataLocHeader[row]['internalID'], accessToken);
              method = dataLocHeader[row]['method'];
              URL = SERVICE_URLS.AIN.BASE_PATH + 'location(' + locationID + ')';
              resEquipmentDelete = await handleOperation(method, URL, "", accessToken);
    
              resErrorHadling = await handleError(dataLocHeader[row], resEquipmentDelete);
              // statusCode = resDelete.status;
              // logs[data[i]['excelitemID']] = statusCode;
    
            }  
         }
        };
        
     
    
    
    var dataLocComponents = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[1]]);
        for (row in dataLocComponents)
        {
            if ( row > 3 ) {
            
              if (dataLocComponents[row]['method'] == "add"){

                parentId = await getParentIdKey(dataLocComponents[row]['parentID'], accessToken);
                resCurrentChildNodes = await getChildNodesLocationKey(parentId, accessToken)
                updateURL = SERVICE_URLS.AIN.BASE_PATH + 'location(' + parentId + ')/components'
    
                componentChildrenId = await getLocationKey(dataLocComponents[row]['internalID'], accessToken);
                method = "update";
                payloadComponents = await prepareComponentsPayload(dataLocComponents[row], resCurrentChildNodes);
                resComponentsUpdate = await handleOperation(method, updateURL, payloadComponents, accessToken);
                
                resErrorHadling = await handleError(dataLocComponents[row], resComponentsUpdate); 
    
              }
    
              if (dataLocComponents[row]['method'] == "delete"){
                parentId = await getParentIdKey(dataLocComponents[row]['parentID'], accessToken);
                resCurrentChildNodes = await getChildNodesLocationKey(parentId, accessToken)
                deleteURL = SERVICE_URLS.AIN.BASE_PATH + 'location(' + parentId + ')/components'
                
                componentChildrenId = await getLocationKey(dataLocComponents[row]['internalID'], accessToken);
                method = "update";
                console.log("Delete Child Nodes",resCurrentChildNodes)
                payloadComponents = await prepareComponentsForDeletePayload(resCurrentChildNodes);
                resComponentsDelete = await handleOperation(method, deleteURL, payloadComponents, accessToken);
                
                resErrorHadling = await handleError(dataLocComponents[row], resComponentsDelete); 
                }
    
              //console.log("dataEQComponents", dataEQComponents[row])
              console.log("Parent ID",parentId)
              console.log("Payload Children", payloadComponents)
              //console.log("childNodes", resCurrentChildNodes)
              //console.log("Logs:", logs)
            }
        };
    
    var dataEQAttributeValues = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[3]]);
    for (row in dataEQAttributeValues) {
        if ( row > 3 ) {
    
          if (dataEQAttributeValues[row]['method'] == "update" || dataEQAttributeValues[row]['method'] == "add"){
          equipmentEQAttributeId = await getLocationKey(dataEQAttributeValues[row]['internalID'], accessToken);
          templateEQAttributeId = await getEQTemplateKey(dataEQAttributeValues[row]['eqtemplateID'], accessToken);
          attributeEQGroupId = await getAttributeGroupKey(dataEQAttributeValues[row]['attributegroupID'], accessToken);
          attributeEQId = await getAttributeKey(dataEQAttributeValues[row]['attributeID'], accessToken);
    
          resCurrentTemplates = await getCurrentEQTemplates(equipmentEQAttributeId, accessToken); 
          payloadTemplates = await prepareTemplatesAssignPayload(resCurrentTemplates, templateEQAttributeId);
          updateURL = SERVICE_URLS.AIN.BASE_PATH + "equipment(" + equipmentEQAttributeId + ")/templates";
          method = "update";
          resTemplatesUpdate = await handleOperation(method, updateURL, payloadTemplates, accessToken);
    
          URL = SERVICE_URLS.AIN.BASE_PATH + 'equipment(' + equipmentEQAttributeId + ')/values'
          payloadEQAttributeValues = await prepareEQAttributeValuesPayload(dataEQAttributeValues[row]);
          resEQAttributeValuesUpdate = await handleOperation(method, URL, payloadEQAttributeValues, accessToken);
          
          resErrorHadling = await handleError(dataEQAttributeValues[row], resEQAttributeValuesUpdate);
          }
    
          if (dataEQAttributeValues[row]['method'] == "delete"){
            equipmentEQAttributeId = await getLocationKey(dataEQAttributeValues[row]['internalID'], accessToken);
            templateEQAttributeId = await getEQTemplateKey(dataEQAttributeValues[row]['eqtemplateID'], accessToken);
            attributeEQGroupId = await getAttributeGroupKey(dataEQAttributeValues[row]['attributegroupID'], accessToken);
            attributeEQId = await getAttributeKey(dataEQAttributeValues[row]['attributeID'], accessToken);
            resCurrentTemplates = await getCurrentEQTemplates(equipmentEQAttributeId, accessToken);
    
            payloadTemplates = await prepareTemplatesUnassignPayload(resCurrentTemplates, templateEQAttributeId);
            updateURL = SERVICE_URLS.AIN.BASE_PATH + "equipment(" + equipmentEQAttributeId + ")/templates";
            method = "update";
            resTemplatesDelete = await handleOperation(method, updateURL, payloadTemplates, accessToken);
      
            //URL = SERVICE_URLS.AIN.BASE_PATH + 'equipment(' + equipmentEQAttributeId + ')/values'
            //payloadEQAttributeValues = await prepareEQAttributeValuesPayload(dataEQAttributeValues[row]);
            //resEQAttributeValuesUpdate = await handleOperation(method, URL, payloadEQAttributeValues, accessToken);
            
            resErrorHadling = await handleError(dataEQAttributeValues[row], resTemplatesDelete);
            }
        }
    };
    
    console.log("Logs:", logs)
    
    }
    
    };
    
    this.index();
    
    
    async function getToken() {
      //const apiEndpoint = SERVICE_URLS.AIN.BASE_PATH;
      const tokenEndpoint = "https://aindev.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token";
    
      const clientId = "sb-92993801-a279-49ed-8b04-b3b329a9d676!b72670|ain_broker_live!b1537";
      const clientSecret = "MDrb1IuhcdCz8Nvbh9zsRBk1XWA=";
    
      var res = await axios({
        method: "post",
        url: tokenEndpoint,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      });
    
       var accessToken = res.data.access_token;
       return accessToken
     };
    
    async function getTemplateKey(template, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "templates?$filter=internalId eq '" + template + "'";
      res = await handleOperation( "read" , URL, "", accessToken );
      if (res.data != undefined && res.data != [] && res.data[0] != undefined){
      return res.data[0].id;
      }
      }
    async function getEQTemplateKey(template, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "templates?$filter=internalId eq '" + template + "' and type eq 'Equipment Template'";
      res = await handleOperation( "read" , URL, "", accessToken );
      if (res.data != undefined && res.data != [] && res.data[0] != undefined){
      return res.data[0].id;
      }
      }
    
    async function getLocationKey(location, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "location?$filter=name eq '" + location + "'";
      res = await handleOperation( "read" , URL, "", accessToken );
      if (res.data != undefined && res.data != [] && res.data[0] != undefined){
        return locationID = res.data[0].locationId;
      }
    }
    
    async function getStraightLocationKey(location, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "location?$filter=name eq '" + location + "'";
      res = await handleOperation( "read", URL, "", accessToken );
      if (res.data != undefined && res.data != [] && res.data[0] != undefined  ){
        return locationID = res.data[0].locationID;
      }
    }
    
    async function getChildNodesEquipmentKey(equipment, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "equipment(" + equipment + ")/components?$expand=childNodes";
      res = await handleOperation( "read" , URL, "", accessToken );
      if (res != undefined){
        var currentChildNodes = new Array();
        res.data.childNodes.forEach(function(item) {
          childNodeObj = { id: item.id, order: item.order, objectType: item.objectType, state: item.state }
          currentChildNodes.push(childNodeObj)
      });
      }
      console.log("currentChildNodesFinal",currentChildNodes);
      return currentChildNodes;
      
    }
    
    async function getChildNodesLocationKey(location, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "location(" + location + ")/components?$expand=childNodes";
      res = await handleOperation( "read" , URL, "", accessToken );
      if (res.data != undefined ){
        var currentChildNodes = new Array();
        res.data.childNodes.forEach(function(item) {
          childNodeObj = { id: item.id, order: item.order, objectType: item.objectType, state: item.state }
          currentChildNodes.push(childNodeObj)
      });
      }
      console.log("currentChildNodesFinal",currentChildNodes);
      return currentChildNodes;
    }
    
      async function getLocationEquipmentKey(location, accessToken){
        URL = SERVICE_URLS.AIN.BASE_PATH + "location?$filter=name eq '" + location + "'";
        res = await handleOperation( "read" , URL, "", accessToken );
        if (res.data != undefined && res.data != null && res.data != [] && res.data[0] != undefined ){
          return locationId = res.data[0].locationId;
        }
      
      }
    
      async function getParentIdKey(parentName, accessToken){
        URL = SERVICE_URLS.AIN.BASE_PATH + "location?$filter=name eq '" + parentName + "'";
        res = await handleOperation( "read" , URL, "", accessToken );
        if (res.data != undefined && res.data != null && res.data != [] && res.data[0] != undefined ){
          return parentId = res.data[0].locationId;
        }
        
        }
    
    async function getAttributeGroupKey(attributeGroup, accessToken){
        URL = SERVICE_URLS.AIN.BASE_PATH + "attributegroups?$filter=(substringof('" + attributeGroup + "', name) eq true)";
        res = await handleOperation( "read" , URL, "", accessToken ); //Вызывается функция handleOperation, в которой в зависимости от переданного метода будет вызвана другая функция
        if (res.data != undefined && res.data != null && res.data !== [] && res.data[0] != undefined ){
        return res.data[0].id;
        }
    }
    
    async function getAttributeKey(attribute, accessToken){
        URL = SERVICE_URLS.AIN.BASE_PATH + "attributes?$filter=(substringof('" + attribute + "', name) eq true)";
        res = await handleOperation( "read" , URL, "", accessToken );
        if (res.data != undefined && res.data != null && res.data !== [] && res.data[0] != undefined){
        return res.data[0].id;
        }
    }
    
    async function getSparePartKey(sparepartInternalID, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "parts?$filter=sparepartInternalID eq '"+ sparepartInternalID + "'";
      res = await handleOperation( "read" , URL, "", accessToken );
      if (res.data != undefined && res.data != null && res.data !== [] && res.data[0] != undefined){
      return res.data[0].id;
      }
    }
    
    async function getCurrentEQTemplates(equipment, accessToken){
      URL = SERVICE_URLS.AIN.BASE_PATH + "equipment(" + equipment + ")/templates";
      res = await handleOperation("read", URL, "", accessToken);
      if (res != undefined){
        var currentTemplates = new Array();
        res.data.forEach(function(item) {
          templateObj = { id: item.id }
          currentTemplates.push(templateObj)
      });
      }
      console.log("currentTemplates",currentTemplates);
      return currentTemplates;
      
    }
    
    
    async function prepareLocHeaderPayload(row){
    
      if (parentId != undefined){
        existingParentId = parentId
      } else existingParentId = null;
    
    locationHeaderPayload = {
            description: {
              short: row['description.short'],
              long: row['description.long'],
            },
            internalID: row.internalID,
            parentId: existingParentId,
            templates: [
              {
                id: templateId
              }
            ]
          };
    
    return locationHeaderPayload = JSON.stringify(locationHeaderPayload)
    }

    async function prepareLocHeaderPayloadForUpdate(row){
    
      // if (parentId != undefined){
      //   existingParentId = parentId
      // } else existingParentId = null;
    
    locationHeaderPayload = {
            functionalLocationID: locationID,
            description: {
              short: row['description.short'],
              long: row['description.long'],
            },
            templates: [
              {
                id: templateId
              }
            ]
          };
    
    return locationHeaderPayload = JSON.stringify(locationHeaderPayload)
    }
    
    // async function prepareLocTemplatesPayload(row)
    // {
    //   locationTemplatesPayload = {
    //     id: locationID,
    //     templates: [{
    //       id: templateId
    //     }]

    //   }
    //   return locationTemplatesPayload = JSON.stringify(locationTemplatesPayload)
    // }

    async function prepareLocAttributesPayload(row){
      maintenancePlant = String(row['adnoc.hdt.maintenancePlant']);
      maintenancePlanningPlant = String(row['adnoc.hdt.maintenancePlanningPlant']);
      var nane;
      locationAttributesPayload = {
        templates: [{
                templateId: templateId,
                attributeGroups: [
                    {
                        attributeGroupId: attributeGroupId,
                        attributes: [
                            {
                                attributeId: attributeKeysArray['objectType'],
                                value1: row['adnoc.objectType']},
                            {
                                  attributeId: attributeKeysArray['startupDate'],
                                  value1: row['adnoc.startupDate']},                                                                       
                            {
                                attributeId: attributeKeysArray['maintenancePlant'],
                                value1:  maintenancePlant},
                            {
                                attributeId: attributeKeysArray['plantSection'],
                                value1: maintenancePlant + '.' + row['adnoc.hdt.plantSection']},
                            {
                                attributeId: attributeKeysArray['plantLocation'],
                                value1: maintenancePlant + '.' + row['adnoc.hdt.plantLocation']},
                            {
                                attributeId: attributeKeysArray['hsecesCategory1'],
                                value1: row['adnoc.hdt.hsecesCategory1']},
                            {
                                attributeId: attributeKeysArray['criticalityCode'],
                                value1: row['adnoc.hdt.criticalityCode']},
                            {
                                attributeId: attributeKeysArray['sortField'],
                                value1: row['adnoc.hdt.sortField']},
                            {
                                attributeId: attributeKeysArray['maintenancePlanningPlant'],
                                value1:  maintenancePlanningPlant},
                            {
                                attributeId: attributeKeysArray['plannerGroup'],
                                value1: maintenancePlant + '.' + row['adnoc.hdt.plannerGroup']},
                            {
                                attributeId: attributeKeysArray['mainWorkCenter'],
                                value1: maintenancePlant + '.' + row['adnoc.hdt.mainWorkCenter']},
                            {
                                attributeId:  attributeKeysArray['catalogProfile'],
                                value1: row['adnoc.hdt.catalogProfile'] },
                            {
                                attributeId:  attributeKeysArray['position'],
                                value1: row['adnoc.position'] }
                        ]
                    }
                ]
        }]
    };
    
    return locationAttributesPayload = JSON.stringify(locationAttributesPayload)
      }
    
    
    async function prepareComponentsPayload(row, currentChildNodes){
      var objectType = 'FL';
      if(currentChildNodes !== []){
      var updateComponentFlag = true;
      };
      if(currentChildNodes !== undefined){
        order = currentChildNodes.length;
        currentChildNodes.forEach(function(item) {
          if (item.id == componentChildrenId){
            updateComponentFlag = false;
          }
      });
      } else {order = null;
        updateComponentFlag = false;};
       if (updateComponentFlag){
         additionalComponent = {
        "id": componentChildrenId,
        "order": order,
        "objectType": objectType,
        "state": null
      };
      currentChildNodes.push(additionalComponent);
    }
      equipmentComponentsPayload = {
        "children": currentChildNodes
      }
    
      return equipmentComponentsPayload = JSON.stringify(equipmentComponentsPayload);
    }
    
    async function prepareComponentsForDeletePayload(currentChildNodes){
      //if(currentChildNodes != undefined){
        var childNodesForDelete = new Array();
        currentChildNodes.forEach(function(item) {
          console.log("ItemID",item.id, componentChildrenId)
          if (item.id != componentChildrenId){
             childNodesForDelete.push(item);
          }
      });
      //}
      equipmentComponentsPayload = {
        "children": childNodesForDelete
      }
      //console.log("Delete payload", equipmentComponentsPayload)
      return equipmentComponentsPayload = JSON.stringify(equipmentComponentsPayload);
    }
    
    async function prepareEQSparePartsPayload(row){
    
      equipmentSparePartsPayload = {
        "assigneeID": assigneeID,
        "operation": row['method'],
        "partAssignments": [{
          "partID": partID,
          "quantity": row['quantity'],
          "advisedStockQuantity": row['advisedStockQuantity'],
          "bomQuantity": row['bomQuantity'],
          "additionalInfo": row['additionalInfo']
        }]
      
      }
      
      return equipmentSparePartsPayload = JSON.stringify(equipmentSparePartsPayload);
    }
    
    async function prepareEQAttributeValuesPayload(row){
      attributeValue = String(row['attrValue']);
      equipmentAttributeValuesPayload = {
        templates: [{
                templateId: templateEQAttributeId,
                attributeGroups: [
                    {
                        attributeGroupId: attributeEQGroupId,
                        attributes: [
                            {
                                attributeId: attributeEQId,
                                value1: attributeValue},
                        ]
                    }
                ]
        }]
    }
    console.log("EQ AttributeValuesPayload", equipmentAttributeValuesPayload)
    return equipmentAttributeValuesPayload = JSON.stringify(equipmentAttributeValuesPayload);
    
    }
    
    async function prepareTemplatesAssignPayload(currentTemplates, templateEQAttributeId){
      
      var updateFlag = true;
      if(currentTemplates !== undefined){
          currentTemplates.forEach(function(item) {
            if (item.id == templateEQAttributeId){
              updateFlag = false;
            }
        });
        } else {updateFlag = false;};
      if (updateFlag){
           additionalTemplate = {
          "id": templateEQAttributeId
        };
        currentTemplates.push(additionalTemplate);
      }
        equipmentTemplatesPayload = {
          "templates": currentTemplates
        }
      
        return equipmentTemplatesPayload = JSON.stringify(equipmentTemplatesPayload);
    }
    
    async function prepareTemplatesUnassignPayload(currentTemplates, templateEQAttributeId){
      //if(currentTemplates != undefined){
        var templatesUnassign = new Array();
        currentTemplates.forEach(function(item) {
          if (item.id != templateEQAttributeId){
              templatesUnassign.push(item);
          }
      });
      //}
      equipmentTemplatesPayload = {
        "templates": templatesUnassign
      }
      console.log("Delete payload",  equipmentTemplatesPayload)
      return  equipmentTemplatesPayload = JSON.stringify( equipmentTemplatesPayload);
    }
    
    async function handleOperation( method, URL, payload, access_token ) {
      switch(method) {
      case "read": return operation( DEFAULT_METHODS.READ, URL, "", access_token );
      case "add": return operation( DEFAULT_METHODS.ADD, URL, payload, access_token );
      case "update": return operation( DEFAULT_METHODS.UPDATE, URL, payload, access_token );
      case "delete": return operation( DEFAULT_METHODS.DELETE, URL, "", access_token );
      default: {
          return {
              status: 400,
              errorMessage: "Method is not valid or not supported."
          }
      }
    }
    };
    
    async function operation( method, URL, payload, access_token ){
      res = await axios({ method: method, url: URL, headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json",}, //Это функция отправляет запрос
                             data: payload }).catch((err) => {console.log("Error response:", err.response.data);
                                                              
                            //  fs.appendFile("logs.txt", JSON.stringify(err.response.data), function(error){
                            //  if(error) throw error; 
                            //  });
                             
                             return err.response });
                             //console.log(res);
                             return res;
                            }
    
    async function handleError (row, resOfAPI) {
    
      if (resOfAPI.status == 200 || resOfAPI.status == 204 ){
        statusCode = resOfAPI.status}
        else statusCode = resOfAPI.data.statusCode;
    
      if (statusCode  == 200 || resOfAPI.status == 204){
        statusText = " Upload successful"
        } else { if (resOfAPI.data.errorMessages != undefined){
        statusText = resOfAPI.data.errorMessages[0].errorMessage}
          else statusText = resOfAPI.data.errorMessage}
    
        logs[row['excelitemID']] = statusCode +" "+ statusText;
    } 


