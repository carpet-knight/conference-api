module.exports = {
    success: (data) => { return { status: 200, data: data} },

    serverError: () => { return { status: 500, type: 'Internal Server Error'} },

    notFound: () => {
        return {
            status: 400,
            type: 'Bad Request',
            message: 'Requested URL not found / Request method not supported'
        }
    },

    custom: (status, type, message) => {
        return {
            status: status,
            type: type,
            message: message
        }
    }
};