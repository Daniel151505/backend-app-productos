import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { PaginationProductDto } from './dto/pagination-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create')
  async createPost(@Res() res, @Body() createProductDTO: CreateProductDto) {
    console.log(res);
    const product = await this.productService.createProduct(createProductDTO);
    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Created',
      product,
    });
  }

  @Get('/')
  async getProducts(@Res() res, @Query() pagination: PaginationProductDto) {
    console.log(res);
    console.log(pagination);
    const products = await this.productService.getProducts(pagination);
    return res.status(HttpStatus.OK).json([...products]);
  }

  @Get('/search')
  async getProductsFilter(
    @Res() res,
    @Query() pagination: PaginationProductDto,
    @Query('filter') filter: FilterProductDto,
    @Query('type') type: FilterProductDto,
  ) {
    const products = await this.productService.searchProducts(
      pagination,
      filter,
      type,
    );
    return res.status(HttpStatus.OK).json([...products]);
  }

  @Get('/:productID')
  async getProduct(@Res() res, @Param('productID') productID) {
    const product = await this.productService.getProduct(productID);
    console.log(product);
    if (!product) throw new NotFoundException('Product Does not exists');
    return res.status(HttpStatus.OK).json(product);
  }

  @Delete('/delete')
  async deleteProduct(@Res() res, @Query('productID') productID) {
    const productDeleted = await this.productService.deleteProduct(productID);
    if (!productDeleted) throw new NotFoundException('Product Does not exists');
    return res.status(HttpStatus.OK).json([productDeleted]);
  }

  @Put('/update')
  async updateProduct(
    @Res() res,
    @Body() createProductDTO: CreateProductDto,
    @Query('productID') productID,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      productID,
      createProductDTO,
    );
    if (!updatedProduct) throw new NotFoundException('Product Does not exists');
    return res.status(HttpStatus.OK).json([updatedProduct]);
  }
}
