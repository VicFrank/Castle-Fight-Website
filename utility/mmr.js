const probability = (winnerRating, loserRating) => {
  probablity =
    (1.0 * 1.0) /
    (1 + 1.0 * Math.pow(10, (1.0 * (loserRating - winnerRating)) / 400));
  return probablity;
};

module.exports = {
  getEloRatingChange(winnerRank, loserRank, K = 50) {
    const Pa = probability(winnerRank, loserRank);
    const ratingChange = Math.floor(K * (1 - Pa), 1);

    return ratingChange;
  }
};
