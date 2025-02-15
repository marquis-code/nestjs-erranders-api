"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductDto = exports.ProductDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const product_schema_1 = require("./product.schema");
class ProductDto {
}
exports.ProductDto = ProductDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Name should not be empty" }),
    (0, class_validator_1.MaxLength)(100, {
        message: "Enter a product name not more than 100 characters",
    }),
    __metadata("design:type", String)
], ProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Description should not be empty" }),
    (0, class_validator_1.MaxLength)(2000, {
        message: "Enter a product description not more than 2000 characters",
    }),
    __metadata("design:type", String)
], ProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "Price should be a number" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Price should not be empty" }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], ProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "Product in stock should be a number" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Product in stock should not be empty" }),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], ProductDto.prototype, "currentInStock", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Category should not be empty" }),
    (0, class_validator_1.IsEnum)(product_schema_1.Category, { message: "Enter a valid category" }),
    __metadata("design:type", String)
], ProductDto.prototype, "category", void 0);
class UpdateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;
//# sourceMappingURL=product.dto.js.map