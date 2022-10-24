import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";

import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";

const ProductDetails = ({ productDetails, similarProducts }) =>
{
	const { image, name, details, price } = productDetails;

	return (
		<div>
			<div className="product-detail-container">
				<div>
					<div className="image-container">
						<img
							src={urlFor(image && image[0])}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getStaticPaths = async () =>
{
	const productsQuery = `*[_type] == "product"]
	{
		slug
		{
			current
		}
	}`;

	const products = await client.fetch(productsQuery);
	const paths = products.map((product) => (
		{
			params:
			{
				slug: product.slug.current
			}
		}));

	return {
		paths,
		fallback: "blocking"
	};
};

export const getStaticProps = async ({ params: { slug } }) =>
{
	const productDetailsQuery = `*[_type == "product" && slug.current == '${slug}'][0]`;
	const similarProductsQuery = `*[_type == "product"]`;

	const productDetails = await client.fetch(productDetailsQuery);
	const similarProducts = await client.fetch(similarProductsQuery);

	return {
		props: { productDetails, similarProducts }
	};
};

export default ProductDetails;
