import { CoverageLabelPipe } from './coverage-label.pipe';

describe('CoverageLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new CoverageLabelPipe();
    expect(pipe).toBeTruthy();
  });
});
