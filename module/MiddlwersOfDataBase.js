



exports.PopulateGenerator  =  ( Schema , path , select ) => {
    Schema.pre(/^find/ ,function(next){
        this.populate({path,select});
        next();
    } )  
}




exports.ImageUrlHandler= (  Schema ) => {
    Schema.post( [ "init" , "save"],function ( doucement ){
        if ( doucement.image){
            const RouteName = doucement.image.split('-')[0]
            const UrlOfImage = `${process.env.DOMAINE_NAME}/${RouteName}/${doucement.image}`
            doucement.image = UrlOfImage ; 
        }
    })
    
}


