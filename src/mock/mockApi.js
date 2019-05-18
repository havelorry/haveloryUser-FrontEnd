export const request = (timeout, error=false) => new Promise((resolve,reject) =>{
    setTimeout(() => {
        if (error) {
            reject({
                message:'Error in data'
            })
        } else{
           resolve({
               data:{
                   'token':'256785'
               }
           })     
        }
    }, timeout);
})