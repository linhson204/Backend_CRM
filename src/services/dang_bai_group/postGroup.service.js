const PostGroup = require('../../models/dang_bai_group/postGroup.model');

const createPost = async (postBody) => {
  const post = PostGroup.create(postBody);
  return post;
};

const getPostById = async (postId) => {
  return PostGroup.findById(postId);
};

const queryPost = async (filter, options) => {
  const posts = PostGroup.paginate(filter, options);
  return posts;
};

const updatePostById = async (postId, updateBody) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new Error('PostGroup not found');
  }
  Object.assign(post, updateBody);
  await post.save();
  return post;
};

const deletePost = async (postId) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new Error('PostGroup not found');
  }
  await post.remove();
  return post;
};

module.exports = {
  createPost,
  getPostById,
  queryPost,
  updatePostById,
  deletePost,
};
