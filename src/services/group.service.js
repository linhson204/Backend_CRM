const { getCollection } = require('../database');

/**
 * Lấy dữ liệu nhóm từ cơ sở dữ liệu
 * @param {string} userId - ID người dùng
 * @param {string} groupName - Tên nhóm (optional)
 * @param {number} limit - Số lượng giới hạn (0 = không giới hạn)
 * @param {number} page - Trang hiện tại (mặc định = 1)
 * @returns {Promise<Array>} - Danh sách nhóm
 */
const getGroupsData = async (userId, groupName = null, limit = 0, page = 1) => {
  try {
    const collection = getCollection('Link-groups');

    // Tạo pipeline aggregation
    const pipeline = [];

    // Bước 1: Match theo điều kiện cơ bản
    const matchStage = {};

    if (groupName) {
      matchStage.Name = { $regex: groupName, $options: 'i' };
    }

    if (userId) {
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

    // Bước 4: Phân trang
    if (limit > 0) {
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
    }

    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error('Error in getGroupsData:', error);
    throw error;
  }
};

module.exports = {
  getGroupsData,
};
