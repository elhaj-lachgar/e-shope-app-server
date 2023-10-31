
class ApiFeatures {
    constructor ( MongooseQuery , query ){
        this.queryParams = query;
        this.MongooseQuery  = MongooseQuery ;
        this.page = query.page ;
        this.limit = query.limit;
        this.keyword = query.keyword;
        this.fields = query.fields;
        this.sort = query.sort;
    }
    Filtre () {
        delete this.queryParams.page ;
        delete this.queryParams.limit ;
        delete this.queryParams.sort;
        delete this.queryParams.fields;
        delete this.queryParams.keyword;

        const QueryStr = JSON.stringify(this.queryParams);
        const RegQuery = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.queryParams = JSON.parse(RegQuery);
        
        this.MongooseQuery = this.MongooseQuery.find(this.queryParams);

        return this;
    }
    Pagination (totaleDocumenet) {

        const page = this.page || 1 ;
        const limit = this.limit || 10 ;
        const skipValue  = ( page - 1) * (limit) ; 
   
        const pagination = {} ;
        const endPage = limit * page ;
        pagination.limit = +limit ;
        pagination.numberOfPage = Math.ceil(totaleDocumenet / limit );


        if ( endPage < totaleDocumenet ){
            pagination.nextPage = + page + 1 ;
        }



        if( skipValue > 0 ){
            pagination.prePage = +page - 1 ;
        }


        this.MongooseQuery = this.MongooseQuery.skip(skipValue).limit(limit)
        this.pagination = pagination ;
        return this ;
    }

    Sort( ) {
        if ( this.sort){
            const sortStr = this.sort.split(',').join(' ')
            this.MongooseQuery = this.MongooseQuery.sort(sortStr);
        }
        else{
            this.MongooseQuery = this.MongooseQuery.sort("-createdAt");
        }
        
        return this;
    }
    FieldsBy () {
        if ( this.fields){
            const fieldsStr = this.fields.split(',').join(' ')
            this.MongooseQuery = this.MongooseQuery.select(fieldsStr);
        }
        else{
            this.MongooseQuery = this.MongooseQuery.select("-createdAt");
        }
        return this ;
    }
    SearchBy (moduleName = 'product') {
        if( this.keyword ){
            const query = {}
            if ( moduleName == 'product'){
                query.$or = [
                    {title : {$regex :this.keyword ,$options : 'i' }},
                    {description: {$regex :this.keyword ,$options : 'i' }},
                ]
                       
            }
            else{
                query.$or = [
                    {name : {$regex :this.keyword ,$options : 'i' }},
                ]
            }
            this.MongooseQuery= this.MongooseQuery.find(query)     
        }
        return this ;
    }
}


module.exports = ApiFeatures;