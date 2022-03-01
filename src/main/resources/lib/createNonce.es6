const createNonceService = __.newBean('no.bouvet.lib.createNonce.CreateNonce');
const getCreatedNonceFromService = () => (__.toNativeObject(createNonceService.getCreatedNonce()));

exports.getCreatedNonce = () => getCreatedNonceFromService();
