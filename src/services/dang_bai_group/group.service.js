const { getCollection } = require('../../database');

// Lấy dữ liệu nhóm từ cơ sở dữ liệu

const getGroupsData = async (userId, groupName = null, userStatus = null) => {
  try {
    const collection = getCollection('Link-groups');
    // const collection = getCollection('posts');

    // Tạo pipeline aggregation
    const pipeline = [];

    // Bước 1: Match theo điều kiện cơ bản
    const matchStage = {};

    if (groupName) {
      matchStage.Name = { $regex: groupName, $options: 'i' };
    }

    // Nếu có userStatus và userId thì filter theo trạng thái tham gia
    if (userId && userStatus) {
      if (userStatus === 'Đã tham gia') {
        matchStage.Joined_Accounts = { $in: [userId] };
      } else if (userStatus === 'Chờ duyệt') {
        matchStage.Temp_Joined_Accounts = { $in: [userId] };
      } else if (userStatus === 'Chưa tham gia') {
        matchStage.$and = [
          { $or: [{ Joined_Accounts: { $exists: false } }, { Joined_Accounts: { $not: { $in: [userId] } } }] },
          { $or: [{ Temp_Joined_Accounts: { $exists: false } }, { Temp_Joined_Accounts: { $not: { $in: [userId] } } }] },
        ];
      }
    } else if (userId && !userStatus) {
      // Logic cũ: lấy các nhóm mà user đã tham gia hoặc chờ duyệt
      matchStage.$or = [{ Joined_Accounts: { $in: [userId] } }, { Temp_Joined_Accounts: { $in: [userId] } }];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Bước 2: Thêm trường trạng thái dựa trên user_id
    if (userId) {
      pipeline.push({
        $addFields: {
          user_status: {
            $cond: {
              if: { $in: [userId, { $ifNull: ['$Joined_Accounts', []] }] },
              then: 'Đã tham gia',
              else: {
                $cond: {
                  if: { $in: [userId, { $ifNull: ['$Temp_Joined_Accounts', []] }] },
                  then: 'Chờ duyệt',
                  else: 'Chưa tham gia',
                },
              },
            },
          },
        },
      });
    } else {
      // Nếu không có user_id, set trạng thái mặc định
      pipeline.push({
        $addFields: {
          user_status: 'Không xác định',
        },
      });
    }

    // Bước 3: Sắp xếp
    pipeline.push({ $sort: { Name: 1 } });

    // Loại bỏ pagination khỏi service, để controller xử lý
    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error('Error in getGroupsData:', error);
    throw error;
  }
};

const uploadAnswer = async (group_link, question, answer) => {
  const collection = getCollection('Questions');
  // const collection = getCollection('posts');

  const result = await collection.updateOne(
    { Group_link: group_link, Question: question },
    { $set: { Answer: answer, Status: 'Đã trả lời' } }
  );

  if (result.matched_count === 0) {
    return { message: 'Không tìm thấy câu hỏi', status: 404 };
  }

  if (result.modified_count === 0) {
    return { message: 'Câu hỏi đã được trả lời trước đó', status: 400 };
  }

  return { message: 'Cập nhật câu trả lời thành công', status: 200 };
};

const getQuestionData = async (status = '', group_name = '', limit = 0, page = 1) => {
  const collection = getCollection('Questions');
  // const collection = getCollection('posts');
  const pipeline = [];

  // Bước 1: Join với collection Link-groups
  pipeline.push({
    $lookup: {
      from: 'Link-groups',
      localField: 'Group_link', // field trong Questions
      foreignField: 'Link', // field trong Link-groups
      as: 'group_info',
    },
  });

  // Bước 2: Unwind group_info
  pipeline.push({
    $unwind: {
      path: '$group_info',
      preserveNullAndEmptyArrays: true,
    },
  });

  // Bước 3: Match theo điều kiện
  const matchStage = {};
  if (status && status !== '') {
    matchStage.Status = status;
  }
  if (group_name && group_name !== '') {
    matchStage['group_info.Name'] = { $regex: group_name, $options: 'i' };
  }
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Bước 4: Sort theo Time (mới nhất trước)
  pipeline.push({ $sort: { Time: -1 } });

  // Bước 5: Pagination
  if (limit > 0) {
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
  }

  // Query Mongo
  const result = await collection.aggregate(pipeline).toArray();
  return result;
};

const sendCommandService = async (crm_id, user_id, type, params) => {
  const commandCollection = getCollection('Commands');
  // const commandCollection = getCollection('posts');

  // ---- join_group ----
  if (type === 'join_group') {
    await commandCollection.insertOne({
      crm_id,
      user_id,
      type: 'join_group',
      params,
      Status: 'Chưa xử lý',
    });
    return { message: 'Thêm lệnh thành công', status: 200 };
  }

  // ---- post_to_group ----
  if (type === 'post_to_group') {
    if (!params.group_link) {
      return { message: 'Thiếu thông tin group_link', status: 400 };
    }
    if (!params.content) {
      return { message: 'Thiếu thông tin content', status: 400 };
    }

    // Lưu bài đăng
    const postCollection = getCollection('Bai-dang');
    const result = await postCollection.insertOne({
      crm_id,
      user_id,
      group_link: params.group_link,
      content: params.content,
      files: params.files || [],
      status: 'Chưa xử lý',
    });

    // Thêm oid vào params
    params.oid = result.insertedId.toString();

    // Lưu command
    await commandCollection.insertOne({
      crm_id,
      user_id,
      type: 'post_to_group',
      params,
      Status: 'Chưa xử lý',
    });

    return { message: 'Thêm lệnh thành công', status: 200 };
  }

  // ---- type không hợp lệ ----
  return { message: 'Lệnh không hợp lệ', status: 400 };
};

module.exports = {
  getGroupsData,
  uploadAnswer,
  getQuestionData,
  sendCommandService,
};
