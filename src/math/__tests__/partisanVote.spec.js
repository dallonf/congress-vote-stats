import { getPartisanRating } from '../partisanVote';

it('identifies a 100% Republican vote', () => {
  const data = {
    repYes: 231,
    repNo: 0,
    demYes: 0,
    demNo: 185,
  };
  expect(getPartisanRating(data)).toEqual({
    party: 'R',
    value: 1,
  });
});

it('identifies a 100% Democrat vote', () => {
  const data = {
    repYes: 0,
    repNo: 231,
    demYes: 185,
    demNo: 0,
  };
  expect(getPartisanRating(data)).toEqual({
    party: 'D',
    value: 1,
  });
});

it('identifies a unanimous vote', () => {
  const data = {
    repYes: 231,
    repNo: 0,
    demYes: 192,
    demNo: 0,
  };
  expect(getPartisanRating(data)).toEqual({
    party: null,
    value: 0,
  });
});

it('computes a (slightly) more bipartisan Republican vote', () => {
  const data = {
    demNo: 111,
    demYes: 76,
    repNo: 0,
    repYes: 231,
  };
  const rating = getPartisanRating(data);
  expect(rating.party).toEqual('R');
  expect(rating).toMatchSnapshot();
});
