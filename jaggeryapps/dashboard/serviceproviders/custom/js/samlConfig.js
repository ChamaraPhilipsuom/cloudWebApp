function drawSAMLConfigPage(issuer, isEditSP, tableTitle, samlsp) {
    var providerProps = {};
    for (var i in samlsp.properties) {
        var prop = samlsp.properties[i];
        providerProps[prop.name] = prop;
    }
    $('#addServiceProvider h4').html(tableTitle);
    $('#issuer').val(providerProps["issuer"].value);
    $('#hiddenIssuer').val(issuer);

    if(providerProps["hiddenFields"] != null && providerProps["hiddenFields"].value.length > 0){
        $('#hiddenFields').val(providerProps["hiddenFields"].value)
    }
    if (isEditSP && providerProps["assertionConsumerURLs"] != null && providerProps["assertionConsumerURLs"].value.length > 0) {
        var assertionConsumerURLTblRow =
            "<table id=\"assertionConsumerURLsTable\" style=\"margin-bottom: 3px;\" class=\"styledInner table table-bordered col-sm-offset-1\">" +
            "<tbody id=\"assertionConsumerURLsTableBody\">";

        var acsColumnId = 0;
        var defaultAssertionConsumerURLRow = "<option value=\"\">---Select---</option>\n";
        var acsUrls=[];
        if (providerProps["assertionConsumerURLs"].value.indexOf(',') > -1) {
            acsUrls = providerProps["assertionConsumerURLs"].value.split(',');
        } else {
            acsUrls = [providerProps["assertionConsumerURLs"].value]
        }
        for (var i in acsUrls) {
            var assertionConsumerURL = acsUrls[i];

            var trow = " <tr id=\"acsUrl_" + acsColumnId + "\">\n" +
                "<td style=\"padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;\">\n" +
                assertionConsumerURL +
                "</td>" +
                "<td>" +
                "<a onclick=\"removeAssertionConsumerURL('" + assertionConsumerURL + "','acsUrl_" + acsColumnId + "');return false;\"" +
                "href=\"#\" class=\"icon-link\" style=\"background-image: url(../admin/images/delete.gif)\">\n" +
                "Delete" +
                "</a>\n" +
                "</td>\n" +
                "</tr>";
            assertionConsumerURLTblRow = assertionConsumerURLTblRow + trow;
            acsColumnId++;

            var option = "";
            if (assertionConsumerURL == providerProps["defaultAssertionConsumerUrl"].value) {
                option = "<option value=\"" + assertionConsumerURL + "\" selected>" + assertionConsumerURL + "</option>";
            } else {
                option = "<option value=\"" + assertionConsumerURL + "\">" + assertionConsumerURL + "</option>";
            }
            defaultAssertionConsumerURLRow = defaultAssertionConsumerURLRow + option;
        }

        assertionConsumerURLTblRow = assertionConsumerURLTblRow + "</tbody>\n" +
            "</table>\n";
        $('#assertionConsumerURLs').val(providerProps["assertionConsumerURLs"].value);
        $('#currentColumnId').val(acsColumnId);
        $('#assertionConsumerURLTblRow').empty();
        $('#assertionConsumerURLTblRow').append(assertionConsumerURLTblRow);
        $('#defaultAssertionConsumerURL').empty();
        $('#defaultAssertionConsumerURL').append(defaultAssertionConsumerURLRow);
    }
    var nameIDVal = "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
    if (isEditSP && providerProps["nameIdFormat"].value.length > 0) {
        nameIDVal = providerProps["nameIdFormat"].value.replace(/\//g, ":");
    }
    $('#nameIdFormat').val(nameIDVal);
    var certificateAliasRow = "";
    var aliasSet = spConfigCertificateAlias;
    if (isEditSP && providerProps["alias"] != null && providerProps["alias"].value.length > 0) {
        if (aliasSet != null) {
            for (var i in aliasSet) {
                var alias = aliasSet[i];
                if (alias != null) {
                    if (alias == providerProps["alias"].value) {
                        certificateAliasRow = certificateAliasRow + '<option selected="selected" value="' + alias + '">' + alias +
                            '</option>\n';
                    } else {
                        certificateAliasRow = certificateAliasRow + '<option value="' + alias + '">' + alias + '</option>\n';
                    }
                }
            }
        }
        $('#alias').empty();
        $('#alias').append(certificateAliasRow);
    } else {
        if (aliasSet != null) {
            for (var i in aliasSet) {
                var alias = aliasSet[i];
                if (alias != null) {
                    if (alias == 'http://www.w3.org/2000/09/xmldsig#rsa-sha1') {
                        certificateAliasRow = certificateAliasRow + '<option selected="selected" value="' + alias + '">' + alias +
                            '</option>\n';
                    } else {
                        certificateAliasRow = certificateAliasRow + '<option value="' + alias + '">' + alias + '</option>\n';
                    }
                }
            }
        }
        $('#alias').empty();
        $('#alias').append(certificateAliasRow);
    }


    var defaultSigningAlgorithmRow = "";
    var signAlgorithm = null;
    if (providerProps["signingAlgorithm"] != null && providerProps["signingAlgorithm"].value.length > 0) {
        signAlgorithm = providerProps["signingAlgorithm"].value;
    }
    else {
        signAlgorithm = signingAlgorithmUriByConfig;
    }
    if (spConfigSigningAlgos != null) {
        for (var i in spConfigSigningAlgos) {
            var signingAlgo = spConfigSigningAlgos[i];

            if (signAlgorithm != null && signingAlgo == signAlgorithm) {
                defaultSigningAlgorithmRow = defaultSigningAlgorithmRow + '<option value="' + signingAlgo + '" selected>\n' +
                    signingAlgo + '</option>';
            } else {
                defaultSigningAlgorithmRow = defaultSigningAlgorithmRow + '<option value="' + signingAlgo + '">' + signingAlgo +
                    '</option>\n';
            }
        }
    }
    $('#signingAlgorithm').empty();
    $('#signingAlgorithm').append(defaultSigningAlgorithmRow);

    var digestAlgorithmRow = "";
    var digestAlgorithm = "";
    if (providerProps["digestAlgorithm"] != null && providerProps["digestAlgorithm"].value.length > 0 ) {
        digestAlgorithm = providerProps["digestAlgorithm"].value;
    } else {
        digestAlgorithm = digestAlgorithmUriByConfig;
    }
    if (spConfigDigestAlgos != null) {
        for (var i in spConfigDigestAlgos) {
            var digestAlgo = spConfigDigestAlgos[i];
            if (digestAlgorithm != "" && digestAlgo == digestAlgorithm) {
                digestAlgorithmRow = digestAlgorithmRow + '<option value="' + digestAlgo + '" selected>' + digestAlgo +
                    '</option>';
            } else {
                digestAlgorithmRow = digestAlgorithmRow + '<option value="' + digestAlgo + '">' + digestAlgo +
                    '</option>';
            }
        }
    }
    $('#digestAlgorithm').empty();
    $('#digestAlgorithm').append(digestAlgorithmRow);
    //start from here
    if (isEditSP && providerProps["enableResponseSignature"] != null && providerProps["enableResponseSignature"].value == 'true') {
        $('#enableResponseSignature').prop('checked', true);
    } else {
        $('#enableResponseSignature').prop('checked', false);
    }

    if (isEditSP && providerProps["enableSigValidation"] != null && providerProps["enableSigValidation"].value == 'true') {
        $('#enableSigValidation').prop('checked', true);
    } else {
        $('#enableSigValidation').prop('checked', false);
    }

    if (isEditSP && providerProps["enableEncAssertion"]!= null && providerProps["enableEncAssertion"].value == 'true') {
        $('#enableEncAssertion').prop('checked', true);
    } else {
        $('#enableEncAssertion').prop('checked', false);
    }

    if (isEditSP && providerProps["enableSingleLogout"] != null && providerProps["enableSingleLogout"].value == 'true') {
        $('#enableSingleLogout').prop('checked', true);
        $('#sloResponseURL').prop('disabled', false);
        $('#sloRequestURL').prop('disabled', false);
        $('#sloResponseURL').val(provider.sloResponseURL);
        $('#sloRequestURL').val(provider.sloRequestURL);
    } else {
        $('#enableSingleLogout').prop('checked', false);
        $('#sloResponseURL').prop('disabled', true);
        $('#sloRequestURL').prop('disabled', true);
        $('#sloResponseURL').val("");
        $('#sloRequestURL').val("");
    }

    var appClaimConfigs = appdata.claimConfig.claimMappings;
    var requestedClaimsCounter = 0;
    if (appClaimConfigs != null) {
        if (appClaimConfigs.constructor !== Array) {
            appClaimConfigs = [appClaimConfigs];
        }

        for (var i in appClaimConfigs) {
            var tempClaim = appClaimConfigs[i];
            if (tempClaim.requested == 'true') {
                requestedClaimsCounter = requestedClaimsCounter + 1;
            }
        }
    }
    //spConfigClaimUris
    var applicationSPName = appdata.applicationName;
    var show = false;
    if (applicationSPName == null || applicationSPName.length == 0) {
        if (requestedClaimsCounter > 0) {
            show = true;
        }
    } else {
        show = true;
    }
    if (isEditSP && show) {

        if (providerProps["enableAttributeProfile"] != null && providerProps["enableAttributeProfile"].value == 'true') {
            $('#acsindex').val(providerProps["acsindex"].value);
            $('#attributeIndex').val(providerProps["acsindex"].value);
            $('#enableAttributeProfile').prop("checked", true);
            $('#enableDefaultAttributeProfile').prop("disabled", false);
            $('#enableAttributeProfile').val("true");
            if (providerProps["enableDefaultAttributeProfile"].value == 'true') {
                $('#enableDefaultAttributeProfile').prop("checked", true);
                $('#enableDefaultAttributeProfile').val("true");
                $('#enableDefaultAttributeProfileHidden').val("true");
            }
            else {
                $('#enableDefaultAttributeProfile').prop("checked", false);
                $('#enableDefaultAttributeProfile').val("false");
                $('#enableDefaultAttributeProfileHidden').val("false");
            }
        } else {
            $('#enableAttributeProfile').prop("checked", false);
            $('#enableAttributeProfile').val("false");
            $('#enableDefaultAttributeProfile').prop("checked", false);
            $('#enableDefaultAttributeProfile').prop("disabled", true);
        }
    } else {
        $('#enableAttributeProfile').val("false");
        $('#enableDefaultAttributeProfile').val("false");
        $('#enableAttributeProfile').prop("checked", false);
        $('#enableDefaultAttributeProfile').prop("checked", false);
        $('#enableDefaultAttributeProfile').prop("disabled", true);
    }

    var enableAudienceRestrictionRow = "";
    if (isEditSP && providerProps["enableAudienceRestriction"] != null && providerProps["enableAudienceRestriction"].value == 'true') {
        $('#enableAudienceRestriction').prop("checked",true);
        $('#audience').prop('disabled', false);
    } else {
        $('#enableAudienceRestriction').prop("checked",false);
        $('#audience').prop('disabled', true);
    }
    var audienceTableStyle = "";
    if (providerProps["audienceURLs"] != null && providerProps["audienceURLs"].value.length > 0) {
        audienceTableStyle = "";
    } else {
        audienceTableStyle = "display:none";
    }

    enableAudienceRestrictionRow = enableAudienceRestrictionRow +
        '    <table id="audienceTableId" style="' + audienceTableStyle + '" class="styledInner table table-bordered col-sm-offset-1">' +
        '        <tbody id="audienceTableTbody">';
    var j = 0;
    if (isEditSP && providerProps["audienceURLs"] != null && providerProps["audienceURLs"].value.length > 0) {
        var requestedAudiences = [];
        if (providerProps["audienceURLs"].value.indexOf(',') > -1) {
            requestedAudiences = providerProps["audienceURLs"].value.split(',');
        } else {
            requestedAudiences = [providerProps["audienceURLs"].value]
        }
        for (var i in requestedAudiences) {
            var audience = requestedAudiences[i];
            if (audience != null && "null" != audience) {
                enableAudienceRestrictionRow = enableAudienceRestrictionRow + '<tr id="audienceRow' + j + '">' +
                    '                    <td style="padding-left: 15px ! important; color: rgb(119, 119, 119); font-style: italic;">' +
                    '                    <input type="hidden" name="audiencePropertyName' + j + '"' +
                    '                id="audiencePropertyName' + j + '" value="' + audience + '"/>' + audience +
                    '                    </td>' +
                    '                    <td>' +
                    '                    <a onclick="removeAudience(\'' + j + '\');return false;"' +
                    '                href="#" class="icon-link"' +
                    '                style="background-image: url(../admin/images/delete.gif)">Delete' +
                    '                    </a>' +
                    '                    </td>' +
                    '                    </tr>';
                j = j + 1;
            }
        }

    }
    $('#audiencePropertyCounter').val(j);
    $('#audienceURLs').val(providerProps["audienceURLs"].value);
    enableAudienceRestrictionRow = enableAudienceRestrictionRow +
        '        </tbody>' +
        '        </table>' ;
    $('#audienceTblRow').empty();
    $('#audienceTblRow').append(enableAudienceRestrictionRow);


    var enableReceiptValidRow = "";

    if (isEditSP && providerProps["enableRecipients"] != null && providerProps["enableRecipients"].value == 'true') {
        $('#enableRecipients').prop("checked",true);
        $('#recipient').prop('disabled', false);
    } else {
        $('#enableRecipients').prop("checked",false);
        $('#recipient').prop('disabled', true);
    }

    var recipientTableStyle = "";
    if (providerProps["receipientURLs"] != null && providerProps["receipientURLs"].value.length > 0) {
        recipientTableStyle = "";
    } else {
        recipientTableStyle = "display:none";
    }
    enableReceiptValidRow = enableReceiptValidRow +
        '    <table id="recipientTableId" style="' + recipientTableStyle + ';" class="styledInner table table-bordered col-sm-offset-1">' +
        '        <tbody id="recipientTableTbody">';

    var k = 0;
    if (isEditSP && providerProps["receipientURLs"] != null && providerProps["receipientURLs"].value.length > 0) {
        var requestedRecipients = [];
        if (providerProps["receipientURLs"].value.indexOf(',') > -1) {
            requestedRecipients = providerProps["receipientURLs"].value.split(',');
        } else {
            requestedRecipients = [providerProps["receipientURLs"].value];
        }

        for (var i in requestedRecipients) {
            var recipient = requestedRecipients[i];
            if (recipient != null && "null" != recipient) {

                enableReceiptValidRow = enableReceiptValidRow + '<tr id="recipientRow' + k + '">' +
                    '                    <td style="padding-left: 15px ! important; color: rgb(119, 119, 119); font-style: italic;">' +
                    '                    <input type="hidden" name="recipientPropertyName' + k + '"' +
                    '                id="recipientPropertyName' + k + '" value="' + recipient + '"/>' + recipient +
                    '                    </td>' +
                    '                    <td>' +
                    '                    <a onclick="removeRecipient(\'' + k + '\');return false;"' +
                    '                href="#" class="icon-link"' +
                    '                style="background-image: url(../admin/images/delete.gif)">Delete' +
                    '                    </a>' +
                    '                    </td>' +
                    '                    </tr>';
                k = k + 1;
            }
        }

    }
    $('#recipientPropertyCounter').val(k);
    $('#receipientURLs').val(providerProps["receipientURLs"].value);
    enableReceiptValidRow = enableReceiptValidRow +
        '        </tbody>' +
        '        </table>' ;
    $('#recptTblRow').empty();
    $('#recptTblRow').append(enableReceiptValidRow);

    if (isEditSP && providerProps["enableIdPInitSSO"] != null && providerProps["enableIdPInitSSO"].value =='true') {
        $('#enableIdPInitSSO').prop("checked",true);
    } else {
        $('#enableIdPInitSSO').prop("checked",false);
    }

    if (isEditSP && providerProps["enableIdPInitSLO"] != null && providerProps["enableIdPInitSLO"].value == 'true') {
        $('#enableIdPInitSLO').prop("checked",true);
        $('#returnToURLTxtBox').prop("disabled",false);
        $('#addReturnToURL').prop("disabled",false);
    } else {
        $('#enableIdPInitSLO').prop("checked",false);
        $('#returnToURLTxtBox').prop("disabled",true);
        $('#addReturnToURL').prop("disabled",true);
    }

    var idpSLOReturnToURLInputRow = '<table id="idpSLOReturnToURLsTbl" style="margin-bottom: 3px;" class="styledInner table table-bordered col-sm-offset-1">\n' +
        '            <tbody id="idpSLOReturnToURLsTblBody">\n';
    var returnToColumnId = 0;
    if (isEditSP && providerProps["idpSLOURLs"] != null && providerProps["idpSLOURLs"].value > 0) {
        var idpInitSLOReturnToURLs = [];
        if (providerProps["idpSLOURLs"].value.indexOf(',') > -1) {
            idpInitSLOReturnToURLs = providerProps["idpSLOURLs"].value.split(',');
        } else {
            idpInitSLOReturnToURLs = [providerProps["idpSLOURLs"].value];
        }
        for (var i in idpInitSLOReturnToURLs) {
            var returnToURL = idpInitSLOReturnToURLs[i];
            if (returnToURL != null && "null" != returnToURL) {
                idpSLOReturnToURLInputRow = idpSLOReturnToURLInputRow + '<tr id="returnToUrl_' + returnToColumnId + '">' +
                    '                    <td style="padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;">' +
                    returnToURL +
                    '                    </td>' +
                    '                    <td>' +
                    '                    <a onclick="removeSloReturnToURL(\'' + returnToURL + '\', \'returnToUrl_' + returnToColumnId + '\');return false;"' +
                    '                href="#" class="icon-link"' +
                    '                style="background-image: url(../admin/images/delete.gif)">' +
                    '                    Delete' +
                    '                    </a>' +
                    '                    </td>' +
                    '                    </tr>';
                returnToColumnId = returnToColumnId + 1;
            }
        }
    }
    idpSLOReturnToURLInputRow = idpSLOReturnToURLInputRow + '</tbody>' +
        '        </table>';
    $('#idpSLOURLs').val(providerProps["idpSLOURLs"].value);
    $('#currentReturnToColumnId').val(returnToColumnId);


    $("#idpSLOReturnToURLInputRow").empty();
    $("#idpSLOReturnToURLInputRow").append(idpSLOReturnToURLInputRow);
    if (isEditSP && providerProps["acsindex"] != null && providerProps["acsindex"].value.length > 0) {
        $('#attributeConsumingServiceIndex').val(providerProps["acsindex"].value);
        $('#acsindex').val(providerProps["acsindex"].value);
    }
    $('#samlAttrIndexForm').show();
}

function preDrawSAMLConfigPage(samlsp) {
    serviceProviders = null;
    spConfigClaimUris = null;
    spConfigCertificateAlias = null;
    spConfigSigningAlgos = null;
    spConfigDigestAlgos = null;
    signingAlgorithmUriByConfig = null;
    digestAlgorithmUriByConfig = null;

    $.ajax({
        url: "/dashboard/serviceproviders/custom/controllers/custom/samlSSOConfigClient.jag",
        type: "GET",
        data: "&cookie=" + cookie + "&user=" + userName,
        success: function (data) {
            samlClient = $.parseJSON(data);
            var tableTitle = "Configurations For " + samlsp.friendlyName;
            var isEditSP = false;
            var issuer = samlsp.inboundAuthKey;
            if(samlsp.inboundAuthKey != null && samlsp.inboundAuthKey.length > 0){
                isEditSP = true;
            }
            //have to set
            $('#issuersaml').val(issuer);
            $('#isEditSp').val(isEditSP);
            //$('#acsindex').val(provider.attributeConsumingServiceIndex);
            spConfigClaimUris = samlClient.claimURIs;
            spConfigCertificateAlias = samlClient.certAliases;
            spConfigSigningAlgos = samlClient.signingAlgos;
            spConfigDigestAlgos = samlClient.digestAlgos;
            signingAlgorithmUriByConfig = samlClient.signingAlgo;
            digestAlgorithmUriByConfig = samlClient.digestAlgo;
            drawSAMLConfigPage(issuer, isEditSP, tableTitle, samlsp);
        },
        error: function (e) {
            message({
                content: 'Error occurred while getting the service provider configuration.',
                type: 'error',
                cbk: function () {
                }
            });
        }
    });
}

function drawSalesForce(salesforceConfig){
    showSamlForm();
    $('#oauthPanel').hide();
    $('#wsfedPanel').hide();
    $('#samlRgsterBtn').hide();
    $('#samlUpdtBtn').hide();
    $('#samlCanclBtn').hide();
    $('#idpInitSLORow').hide();
    $('#idpInitSSORow').hide();
    $('#receipientRow').hide();
    $('#audienceRestrictionRow').hide();
    $('#attributeRow').hide();
    $('#singleLogoutRow').hide();
    $('#nameIDRow').hide();
    $('#issuerRow').hide();
    $('#addServiceProvider h4').html('Salesforce Configuration');
    $('#spType').val('salesforce');

    var signAlgorithm = signingAlgorithmUriByConfig;
    var digestAlgorithm = digestAlgorithmUriByConfig;
    var doSignResponse = false;
    var doValidateSignatureInRequests = false;
    var doEnableEncryptedAssertion = false;
    var certAlias = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
    var acsurls = null;
    var defaultacs = null;
    var salesforceProperties = {};
    if(salesforceConfig != null && salesforceConfig.properties != null){
        if(salesforceConfig.properties.constructor !== Array){
            salesforceConfig.properties = [salesforceConfig.properties.constructor];
        }
        for (var i in salesforceConfig.properties) {
            salesforceProperties[salesforceConfig.properties[i].name] = salesforceConfig.properties[i];
        }
        if (salesforceProperties["enableEncAssertion"].value == "true") {
            doEnableEncryptedAssertion = true;
        }
        if (salesforceProperties["enableResponseSignature"].value == "true") {
            doSignResponse = true;
        }
        if (salesforceProperties["enableSigValidation"].value == "true") {
            doValidateSignatureInRequests = true;
        }
        if (salesforceProperties["signingAlgorithm"].value != null && salesforceProperties["signingAlgorithm"].value.length > 0) {
            signAlgorithm = salesforceProperties["signingAlgorithm"].value;
        }
        if (salesforceProperties["digestAlgorithm"].value != null && salesforceProperties["digestAlgorithm"].value.length > 0) {
            digestAlgorithm = salesforceProperties["digestAlgorithm"].value;
        }
        if (salesforceProperties["alias"].value != null && salesforceProperties["alias"].value.length > 0) {
            certAlias = salesforceProperties["alias"].value;
        }
        if (salesforceProperties["assertionConsumerURLs"].value != null && salesforceProperties["assertionConsumerURLs"].value.length > 0) {
            acsurls = salesforceProperties["assertionConsumerURLs"].value.split(',');
        }
        if (salesforceProperties["defaultAssertionConsumerURL"].value != null && salesforceProperties["defaultAssertionConsumerURL"].value.length > 0) {
            defaultacs = salesforceProperties["defaultAssertionConsumerURL"].value;
        }
        if (salesforceProperties["issuer"].value != null && salesforceProperties["issuer"].value.length > 0) {
            $('#hiddenIssuer').val(salesforceProperties["issuer"].value);
        }

    }
    var defaultAssertionConsumerURLRow = "<option value=\"\">---Select---</option>\n";
    if (acsurls != null) {
        var assertionConsumerURLTblRow =
            "<table id=\"assertionConsumerURLsTable\" style=\"margin-bottom: 3px;\" class=\"styledInner table table-bordered col-sm-offset-1\">" +
            "<tbody id=\"assertionConsumerURLsTableBody\">";

        var assertionConsumerURLsBuilder = "";
        var acsColumnId = 0;
        if (acsurls.constructor !== Array) {
            acsurls = [acsurls];
        }
        if (defaultacs == null) {
            defaultacs = acsurls[0];
        }
        for (var i in acsurls) {
            var assertionConsumerURL = acsurls[i];
            var option = "";
            if (assertionConsumerURL == defaultacs) {
                option = "<option value=\"" + assertionConsumerURL + "\" selected>" + assertionConsumerURL + "</option>";
            } else {
                option = "<option value=\"" + assertionConsumerURL + "\">" + assertionConsumerURL + "</option>";
            }
            defaultAssertionConsumerURLRow = defaultAssertionConsumerURLRow + option;

            if (assertionConsumerURLsBuilder.length > 0) {
                assertionConsumerURLsBuilder = assertionConsumerURLsBuilder + "," + assertionConsumerURL;
            } else {
                assertionConsumerURLsBuilder = assertionConsumerURLsBuilder + assertionConsumerURL;
            }

            var trow = " <tr id=\"acsUrl_" + acsColumnId + "\">\n" +
                "<td style=\"padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;\">\n" +
                assertionConsumerURL +
                "</td>" +
                "<td>" +
                "<a onclick=\"removeAssertionConsumerURL('" + assertionConsumerURL + "','acsUrl_" + acsColumnId + "');return false;\"" +
                "href=\"#\" class=\"icon-link\" style=\"background-image: url(../admin/images/delete.gif)\">\n" +
                "Delete" +
                "</a>\n" +
                "</td>\n" +
                "</tr>";
            assertionConsumerURLTblRow = assertionConsumerURLTblRow + trow;
            acsColumnId++;
        }

        var assertionConsumerURL = assertionConsumerURLsBuilder.length > 0 ? assertionConsumerURLsBuilder : "";
        assertionConsumerURLTblRow = assertionConsumerURLTblRow + "</tbody>\n" +
            "</table>\n";
        $('#assertionConsumerURLs').val(assertionConsumerURL);
        $('#currentColumnId').val(acsColumnId);
        $('#assertionConsumerURLTblRow').empty();
        $('#assertionConsumerURLTblRow').append(assertionConsumerURLTblRow);
    }
    $('#defaultAssertionConsumerURL').empty();
    $('#defaultAssertionConsumerURL').append(defaultAssertionConsumerURLRow);


    var certificateAliasRow = "";
    if (spConfigCertificateAlias != null) {
        for (var i in spConfigCertificateAlias) {
            var alias = spConfigCertificateAlias[i];
            if (alias != null) {
                if (alias == certAlias) {
                    certificateAliasRow = certificateAliasRow + '<option selected="selected" value="' + alias + '">' + alias +
                        '</option>\n';
                } else {
                    certificateAliasRow = certificateAliasRow + '<option value="' + alias + '">' + alias + '</option>\n';
                }
            }
        }
    }
    $('#alias').empty();
    $('#alias').append(certificateAliasRow);


    var defaultSigningAlgorithmRow = "";
    if (spConfigSigningAlgos != null) {
        for (var i in spConfigSigningAlgos) {
            var signingAlgo = spConfigSigningAlgos[i];

            if (signAlgorithm != null && signingAlgo == signAlgorithm) {
                defaultSigningAlgorithmRow = defaultSigningAlgorithmRow + '<option value="' + signingAlgo + '" selected>\n' +
                    signingAlgo + '</option>';
            } else {
                defaultSigningAlgorithmRow = defaultSigningAlgorithmRow + '<option value="' + signingAlgo + '">' + signingAlgo +
                    '</option>\n';
            }
        }
    }
    $('#signingAlgorithm').empty();
    $('#signingAlgorithm').append(defaultSigningAlgorithmRow);

    var digestAlgorithmRow = "";

    if (spConfigDigestAlgos != null) {
        for (var i in spConfigDigestAlgos) {
            var digestAlgo = spConfigDigestAlgos[i];
            if (digestAlgorithm != "" && digestAlgo == digestAlgorithm) {
                digestAlgorithmRow = digestAlgorithmRow + '<option value="' + digestAlgo + '" selected>' + digestAlgo +
                    '</option>';
            } else {
                digestAlgorithmRow = digestAlgorithmRow + '<option value="' + digestAlgo + '">' + digestAlgo +
                    '</option>';
            }
        }
    }
    $('#digestAlgorithm').empty();
    $('#digestAlgorithm').append(digestAlgorithmRow);
    if (doSignResponse) {
        $('#enableResponseSignature').prop('checked', true);
    } else {
        $('#enableResponseSignature').prop('checked', false);
    }

    if (doValidateSignatureInRequests) {
        $('#enableSigValidation').prop('checked', true);
    } else {
        $('#enableSigValidation').prop('checked', false);
    }

    if (doEnableEncryptedAssertion) {
        $('#enableEncAssertion').prop('checked', true);
    } else {
        $('#enableEncAssertion').prop('checked', false);
    }


}

function onClickAddACRUrl() {
    //var isValidated = doValidateInputToConfirm(document.getElementById('assertionConsumerURLTxt'), "<fmt:message key='sp.not.https.endpoint.address'/>",
    //    addAssertionConsumerURL, null, null);
    var isValidated = true;
    if (isValidated) {
        addAssertionConsumerURL();
    }
}

function disableAttributeProfile(chkbx) {
    if(chkbx.checked){
        $('#enableDefaultAttributeProfile').prop("disabled", false);
        $('#enableAttributeProfile').val(true);
    } else {
        $('#enableDefaultAttributeProfile').prop("checked", false);
        $('#enableDefaultAttributeProfile').prop("disabled", true);
        $('#enableAttributeProfile').val(false);
    }
}

function disableDefaultAttributeProfile(chkbx) {
    if (chkbx.checked) {
        $('#enableDefaultAttributeProfileHidden').val("true");
        $('#enableDefaultAttributeProfile').val(true);
    } else {
        $('#enableDefaultAttributeProfileHidden').val("false");
        $('#enableDefaultAttributeProfile').val(false);
    }

}

function disableResponseSignature(chkbx) {
    if (chkbx.checked) {
        $('#enableResponseSignature').val(true);
    } else {
        $('#enableResponseSignature').val(false);
    }
}

function disableSignatureValidation(chkbx) {
    if (chkbx.checked) {
        $('#enableSigValidation').val(true);
    } else {
        $('#enableSigValidation').val(false);
    }
}

function disableEncAssertion(chkbx) {
    if (chkbx.checked) {
        $('#enableEncAssertion').val(true);
    } else {
        $('#enableEncAssertion').val(false);
    }
}


function disableLogoutUrl(chkbx) {
    if ($(chkbx).is(':checked')) {
        $("#sloResponseURL").prop('disabled', false);
        $("#sloRequestURL").prop('disabled', false);
    } else {
        $("#sloResponseURL").prop('disabled', true);
        $("#sloRequestURL").prop('disabled', true);
        $("#sloResponseURL").val("");
        $("#sloRequestURL").val("");
    }
}

function disableAudienceRestriction(chkbx) {
    if ($(chkbx).is(':checked')) {
        $("#audience").prop('disabled', false);
        $("#addAudience").prop('disabled', false);
    } else {
        $("#audience").prop('disabled', true);
        $("#addAudience").prop('disabled', true);
    }
}

function disableRecipients(chkbx) {
    if ($(chkbx).is(':checked')) {
        $("#recipient").prop('disabled', false);
        $("#addRecipient").prop('disabled', false);
    } else {
        $("#recipient").prop('disabled', true);
        $("#addRecipient").prop('disabled', true);
    }
}

function disableIdPInitSSO(chkbx) {
    $('#disableIdPInitSSO').val(chkbx.checked);
}


function disableIdPInitSLO(chkbx) {
    if ($(chkbx).is(':checked')) {
        $("#returnToURLTxtBox").prop('disabled', false);
        $("#addReturnToURL").prop('disabled', false);
    } else {
        $("#returnToURLTxtBox").prop('disabled', true);
        $("#addReturnToURL").prop('disabled', true);
    }
}

function isContainRaw(tbody) {
    if (tbody.childNodes == null || tbody.childNodes.length == 0) {
        return false;
    } else {
        for (var i = 0; i < tbody.childNodes.length; i++) {
            var child = tbody.childNodes[i];
            if (child != undefined && child != null) {
                if (child.nodeName == "tr" || child.nodeName == "TR") {
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 *
 * Manage tables
 */
function addAssertionConsumerURL() {
    var assertionConsumerURL = $("#assertionConsumerURLTxt").val();
    if (assertionConsumerURL == null || assertionConsumerURL.trim().length == 0) {
        //CARBON.showWarningDialog("<fmt:message key='sp.enter.not.valid.endpoint.address'/>", null, null);
        return false;
    }

    assertionConsumerURL = assertionConsumerURL.trim();

    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!regexp.test(assertionConsumerURL) || assertionConsumerURL.indexOf(",") > -1) {
        //CARBON.showWarningDialog("<fmt:message key='sp.enter.not.valid.endpoint.address'/>", null, null);
        return false;
    }

    if ($("#assertionConsumerURLsTable").length == 0) {
        var row =
            '        <table id="assertionConsumerURLsTable" style="margin-bottom: 3px;" class="styledInner table table-bordered col-sm-offset-1">' +
            '            <tbody id="assertionConsumerURLsTableBody">' +
            '            </tbody>' +
            '        </table>' ;
        $('#assertionConsumerURLTblRow').append(row);
        $('#assertionConsumerURLs').val("");
        $('#currentColumnId').val("0");
    }

    var assertionConsumerURLs = $("#assertionConsumerURLs").val();
    var currentColumnId = $("#currentColumnId").val();
    if (assertionConsumerURLs == null || assertionConsumerURLs.trim().length == 0) {

        $("#assertionConsumerURLs").val(assertionConsumerURL);
        var row =
            '<tr id="acsUrl_' + parseInt(currentColumnId) + '">' +
            '</td><td style="padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;">' + assertionConsumerURL +
            '</td><td><a onclick="removeAssertionConsumerURL (\'' + assertionConsumerURL + '\', \'acsUrl_' + parseInt(currentColumnId) + '\');return false;"' +
            'href="#" class="icon-link" style="background-image: url(../admin/images/delete.gif)"> Delete </a></td></tr>';

        $('#assertionConsumerURLsTable tbody').append(row);
        $('#defaultAssertionConsumerURL').append($("<option></option>").attr("value", assertionConsumerURL).text(assertionConsumerURL));
        $('#defaultAssertionConsumerURL').val(assertionConsumerURL);
    } else {
        var isExist = false;
        $.each(assertionConsumerURLs.split(","), function (index, value) {
            if (value === assertionConsumerURL) {
                isExist = true;
                //CARBON.showWarningDialog("<fmt:message key='sp.endpoint.address.already.exists'/>", null, null);
                return false;
            }
        });
        if (isExist) {
            return false;
        }

        $("#assertionConsumerURLs").val(assertionConsumerURLs + "," + assertionConsumerURL);
        var row =
            '<tr id="acsUrl_' + parseInt(currentColumnId) + '">' +
            '</td><td style="padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;">' + assertionConsumerURL +
            '</td><td><a onclick="removeAssertionConsumerURL(\'' + assertionConsumerURL + '\', \'acsUrl_' + parseInt(currentColumnId) + '\');return false;"' +
            'href="#" class="icon-link" style="background-image: url(../admin/images/delete.gif)"> Delete </a></td></tr>';

        $('#assertionConsumerURLsTable tr:last').after(row);
        $('#defaultAssertionConsumerURL').append($("<option></option>").attr("value", assertionConsumerURL).text(assertionConsumerURL));
    }
    $("#assertionConsumerURLTxt").val("");
    $("#currentColumnId").val(parseInt(currentColumnId) + 1);
}

function removeAssertionConsumerURL(assertionConsumerURL, columnId) {

    var assertionConsumerURLs = $("#assertionConsumerURLs").val();
    var defaultAssertionConsumerURL = $('#defaultAssertionConsumerURL').val();
    var newAssertionConsumerURLs = "";
    var isDeletingSelected = false;

    if (assertionConsumerURLs != null && assertionConsumerURLs.trim().length > 0) {
        $.each(assertionConsumerURLs.split(","), function (index, value) {
            if (value === assertionConsumerURL) {
                if (assertionConsumerURL === defaultAssertionConsumerURL) {
                    isDeletingSelected = true;
                }
                return true;
            }

            if (newAssertionConsumerURLs.length > 0) {
                newAssertionConsumerURLs = newAssertionConsumerURLs + "," + value;
            } else {
                newAssertionConsumerURLs = value;
            }
        });
    }

    $('#defaultAssertionConsumerURL option[value="' + assertionConsumerURL + '"]').remove();

    if (isDeletingSelected && newAssertionConsumerURLs.length > 0) {
        $('select[id="defaultAssertionConsumerURL"] option:eq(1)').attr('selected', 'selected');
    }

    $('#' + columnId).remove();
    $("#assertionConsumerURLs").val(newAssertionConsumerURLs);

    if (newAssertionConsumerURLs.length == 0) {
        $('#assertionConsumerURLsTable').remove();
    }
}

function addAudienceFunc() {
    var audience = document.getElementById('audience').value;
    var audienceUrls = $("#audienceURLs").val();
    if (audienceUrls == null || audienceUrls.length == 0) {
        $("#audienceURLs").val(audience);
    } else {
        var isExist = false;
        $.each(audienceUrls.split(","), function (index, value) {
            if (value === audience) {
                isExist = true;
                //CARBON.showWarningDialog("<fmt:message key='sp.endpoint.address.already.exists'/>", null, null);
                return false;
            }
        });
        if (isExist) {
            return false;
        }
        $("#audienceURLs").val(audienceUrls + "," + audience);
    }
    var propertyCount = document.getElementById("audiencePropertyCounter");
    var i = propertyCount.value;
    var currentCount = parseInt(i);
    currentCount = currentCount + 1;
    propertyCount.value = currentCount;
    document.getElementById('audienceTableId').style.display = '';
    var audienceTableTBody = document.getElementById('audienceTableTbody');
    var audienceRow = document.createElement('tr');
    audienceRow.setAttribute('id', 'audienceRow' + i);
    var audiencePropertyTD = document.createElement('td');
    audiencePropertyTD.setAttribute('style', 'padding-left: 15px ! important; color: rgb(119, 119, 119); font-style: italic;');
    audiencePropertyTD.innerHTML = "" + audience + "<input type='hidden' name='audiencePropertyName" + i + "' id='audiencePropertyName" + i + "'  value='" + audience + "'/> ";
    var audienceRemoveTD = document.createElement('td');
    audienceRemoveTD.innerHTML = "<a href='#' class='icon-link' style='background-image: url(../admin/images/delete.gif)' onclick='removeAudience(" + i + ");return false;'>" + "Delete" + "</a>";
    audienceRow.appendChild(audiencePropertyTD);
    audienceRow.appendChild(audienceRemoveTD);
    audienceTableTBody.appendChild(audienceRow);
    $('#audience').val("");
}

function removeAudience(i) {
    var newAudienceUrls = "";
    var audienceUrls = $("#audienceURLs").val();
    var audience = $("#audiencePropertyName"+i).val();
    var propRow = document.getElementById("audienceRow" + i);
    if (propRow != undefined && propRow != null) {
        var parentTBody = propRow.parentNode;
        if (parentTBody != undefined && parentTBody != null) {
            parentTBody.removeChild(propRow);
            if (!isContainRaw(parentTBody)) {
                var propertyTable = document.getElementById("audienceTableId");
                propertyTable.style.display = "none";
            }
        }
    }
    if(audienceUrls != null && audienceUrls.trim().length > 0){
        $.each(audienceUrls.split(","), function (index, value) {
            if (value === audience) {
                return true;
            }

            if (newAudienceUrls.length > 0) {
                newAudienceUrls = newAudienceUrls + "," + value;
            } else {
                newAudienceUrls = value;
            }
        });
    }
    $("#audienceURLs").val(newAudienceUrls);
    if(newAudienceUrls.length == 0){
        $('#audiencePropertyCounter').val("0");
    }
}

function addRecipientFunc() {
    var recipient = document.getElementById('recipient').value;
    var recipientUrls = $("#receipientURLs").val();
    if (recipientUrls == null || recipientUrls.length == 0) {
        $("#receipientURLs").val(recipient);
    } else {
        var isExist = false;
        $.each(recipientUrls.split(","), function (index, value) {
            if (value === recipient) {
                isExist = true;
                //CARBON.showWarningDialog("<fmt:message key='sp.endpoint.address.already.exists'/>", null, null);
                return false;
            }
        });
        if (isExist) {
            return false;
        }
        $("#receipientURLs").val(recipientUrls + "," + recipient);
    }
    var propertyCount = document.getElementById("recipientPropertyCounter");
    var i = propertyCount.value;
    var currentCount = parseInt(i);
    currentCount = currentCount + 1;
    propertyCount.value = currentCount;
    document.getElementById('recipientTableId').style.display = '';
    var recipientTableTBody = document.getElementById('recipientTableTbody');
    var recipientRow = document.createElement('tr');
    recipientRow.setAttribute('id', 'recipientRow' + i);
    var recipientPropertyTD = document.createElement('td');
    recipientPropertyTD.setAttribute('style', 'padding-left: 15px ! important; color: rgb(119, 119, 119); font-style: italic;');
    recipientPropertyTD.innerHTML = "" + recipient + "<input type='hidden' name='recipientPropertyName" + i + "' id='recipientPropertyName" + i + "'  value='" + recipient + "'/> ";
    var recipientRemoveTD = document.createElement('td');
    recipientRemoveTD.innerHTML = "<a href='#' class='icon-link' style='background-image: url(../admin/images/delete.gif)' onclick='removeRecipient(" + i + ");return false;'>" + "Delete" + "</a>";
    recipientRow.appendChild(recipientPropertyTD);
    recipientRow.appendChild(recipientRemoveTD);
    recipientTableTBody.appendChild(recipientRow);
    $('#recipient').val("");
}

function removeRecipient(i) {
    var newReceipientUrls = "";
    var receipientUrls = $("#receipientURLs").val();
    var receipient = $("#recipientPropertyName"+i).val();
    var propRow = document.getElementById("recipientRow" + i);
    if (propRow != undefined && propRow != null) {
        var parentTBody = propRow.parentNode;
        if (parentTBody != undefined && parentTBody != null) {
            parentTBody.removeChild(propRow);
            if (!isContainRaw(parentTBody)) {
                var propertyTable = document.getElementById("recipientTableId");
                propertyTable.style.display = "none";
            }
        }
    }
    if(receipientUrls != null && receipientUrls.trim().length > 0){
        $.each(receipientUrls.split(","), function (index, value) {
            if (value === receipient) {
                return true;
            }

            if (newReceipientUrls.length > 0) {
                newReceipientUrls = newReceipientUrls + "," + value;
            } else {
                newReceipientUrls = value;
            }
        });
    }
    $("#receipientURLs").val(newReceipientUrls);
    if(newReceipientUrls.length == 0){
        $('#recipientPropertyCounter').val("0");
    }
}

function removeSloReturnToURL(returnToURL, columnId) {

    var idpInitSLOReturnToURLs = $("#idpSLOURLs").val();
    var newIdpInitSLOReturnToURLs = "";

    if (idpInitSLOReturnToURLs != null && idpInitSLOReturnToURLs.trim().length > 0) {
        $.each(idpInitSLOReturnToURLs.split(","), function (index, value) {
            if (value === returnToURL) {
                return true;
            }

            if (newIdpInitSLOReturnToURLs.length > 0) {
                newIdpInitSLOReturnToURLs = newIdpInitSLOReturnToURLs + "," + value;
            } else {
                newIdpInitSLOReturnToURLs = value;
            }
        });
    }

    $('#' + columnId).remove();
    $("#idpSLOURLs").val(newIdpInitSLOReturnToURLs);

    if (newIdpInitSLOReturnToURLs.length == 0) {
        $('#idpSLOReturnToURLsTbl').remove();
    }
}

function addSloReturnToURL() {

    var returnToURL = $("#returnToURLTxtBox").val();
    if (returnToURL == null || returnToURL.trim().length == 0) {
        // CARBON.showWarningDialog("<fmt:message key='slo.enter.not.valid.endpoint.address'/>", null, null);
        return false;
    }

    returnToURL = returnToURL.trim();

    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!regexp.test(returnToURL) || returnToURL.indexOf(",") > -1) {
        //CARBON.showWarningDialog("<fmt:message key='slo.enter.not.valid.endpoint.address'/>", null, null);
        return false;
    }

    if ($("#idpSLOReturnToURLsTbl").length==0) {
        var row =
            '        <table id="idpSLOReturnToURLsTbl" style="margin-bottom: 3px;" class="styledInner table table-bordered col-sm-offset-1">' +
            '            <tbody id="idpSLOReturnToURLsTblBody">' +
            '            </tbody>' +
            '        </table>' ;
        $('#idpSLOReturnToURLInputRow').append(row);
        $('#currentReturnToColumnId').val("0");
    }

    var idpInitSLOReturnToURLs = $("#idpSLOURLs").val();
    var currentColumnId = $("#currentReturnToColumnId").val();
    if (idpInitSLOReturnToURLs == null || idpInitSLOReturnToURLs.trim().length == 0) {
        $("#idpSLOURLs").val(returnToURL);
        var row =
            '<tr id="returnToUrl_' + parseInt(currentColumnId) + '">' +
            '</td><td style="padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;">' + returnToURL +
            '</td><td><a onclick="removeSloReturnToURL(\'' + returnToURL + '\', \'returnToUrl_' +
            parseInt(currentColumnId) + '\');return false;"' +
            'href="#" class="icon-link" style="background-image: url(../admin/images/delete.gif)"> Delete </a></td></tr>';

        $('#idpSLOReturnToURLsTbl tbody').append(row);
    } else {
        var isExist = false;
        $.each(idpInitSLOReturnToURLs.split(","), function (index, value) {
            if (value === returnToURL) {
                isExist = true;
                //CARBON.showWarningDialog("<fmt:message key='slo.endpoint.address.already.exists'/>", null, null);
                return false;
            }
        });
        if (isExist) {
            return false;
        }

        $("#idpSLOURLs").val(idpInitSLOReturnToURLs + "," + returnToURL);
        var row =
            '<tr id="returnToUrl_' + parseInt(currentColumnId) + '">' +
            '</td><td style="padding-left: 15px !important; color: rgb(119, 119, 119);font-style: italic;">' +
            returnToURL + '</td><td><a onclick="removeSloReturnToURL(\'' + returnToURL + '\', \'returnToUrl_' + parseInt(currentColumnId) + '\');return false;"' +
            'href="#" class="icon-link" style="background-image: url(../admin/images/delete.gif)"> Delete </a></td></tr>';

        $('#idpSLOReturnToURLsTbl tr:last').after(row);
    }
    $("#returnToURLTxtBox").val("");
    $("#currentReturnToColumnId").val(parseInt(currentColumnId) + 1);
}




