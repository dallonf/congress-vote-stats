export const getPartisanRating = ({ repYes, repNo, demYes, demNo }) => {
  const rep = repYes / (repYes + repNo);
  const dem = demYes / (demYes + demNo);

  if (rep > dem) {
    return { party: 'R', value: rep - dem };
  } else if (dem > rep) {
    return { party: 'D', value: dem - rep };
  } else {
    return { party: null, value: 0 };
  }
};

export const getPartisanRatingForVote = vote =>
  getPartisanRating({
    repYes: vote.republican.yes,
    repNo: vote.republican.no,
    demYes: vote.democratic.yes,
    demNo: vote.democratic.no,
  });
