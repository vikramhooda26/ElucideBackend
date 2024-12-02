import axios from "axios";

const getInstagramFollowersCount = async () => {
    try {
        const response = await axios.get(
            "https://graph.facebook.com/v21.0/${igBusinessId}?fields=followers_count&access_token=${accessToken}",
        );
        return response.data.followers_count || 0;
    } catch (error) {
        //@ts-ignore
        console.error("Error fetching Instagram followers count:", error.response?.data || error.message);
        throw error;
    }
};

getInstagramFollowersCount();
