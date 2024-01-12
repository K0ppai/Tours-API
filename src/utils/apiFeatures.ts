class APIFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Destructuring the query to mutate
    const queryObj: { [key: string]: string } = { ...this.queryString };

    // Exclude the fields that are not in the model
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert the query to string and replace the operators
    let queryStr: string = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: string) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // Sorting
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // Field limiting
    if (this.queryString.fields) {
      const fileds = (this.queryString.fields as string).split(',').join(' ');
      this.query = this.query.select(fileds);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // Pagination
    const page = parseInt(this.queryString.page as string) || 1;
    const limit = parseInt(this.queryString.limit as string) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;