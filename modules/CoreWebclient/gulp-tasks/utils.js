const Utils = require('/modules/CoreWebclient/js/utils/Common.js')

export default {
    sendRequest: function(sModule, sMethod, oParameters, fResponseHandler) {
        const oHeader = { 'X-Client': 'WebClient' }
    
        let deviceId = $.cookie('DeviceId')
        if (!deviceId) {
            deviceId = Utils.generateUUID()
            $.cookie('DeviceId', deviceId, { expires: 365 })
        }
        
        oHeader['X-DeviceId'] = deviceId
    
        const requestPayload = {
            Module: sModule,
            Method: sMethod,
            Parameters: JSON.stringify(oParameters),
        }

        let sHost = '?/Api/'
        let bWithCredentials = false

        try {
            if (process.env.NODE_ENV === 'development') {
              sHost = process.env.VUE_APP_API_HOST + sHost
              bWithCredentials = true
            }
        } catch (e) {}

        $.ajax({
            url: sHost,
            type: 'POST',
            async: true,
            dataType: 'json',
            headers: oHeader,
            data: requestPayload,
            complete: fResponseHandler,
            xhrFields: {
                withCredentials: bWithCredentials
            }
        })
    }
}