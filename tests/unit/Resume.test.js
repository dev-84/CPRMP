const Resume = require('../../backend/src/models/Resume');

describe('Resume model', () => {
  test('requires studentProfileId and file metadata', async () => {
    const resume = new Resume({});

    try {
      await resume.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.studentProfileId).toBeDefined();
      expect(error.errors.originalFilename).toBeDefined();
      expect(error.errors.storageKey).toBeDefined();
      expect(error.errors.mimeType).toBeDefined();
      expect(error.errors.sizeBytes).toBeDefined();
      expect(error.errors.checksum).toBeUndefined();
    }
  });

  test('allows checksum to be omitted', async () => {
    const resume = new Resume({
      studentProfileId: '507f1f77bcf86cd799439011',
      originalFilename: 'resume.pdf',
      storageKey: 'resumes/example.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1024,
    });

    await expect(resume.validate()).resolves.toBeUndefined();
  });

  test('requires isActive and defaults it to true, and defaults uploadedAt', async () => {
    const resume = new Resume({
      studentProfileId: '507f1f77bcf86cd799439011',
      originalFilename: 'resume.pdf',
      storageKey: 'resumes/example.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1024,
      checksum: 'example-checksum',
    });

    expect(resume.isActive).toBe(true);
    expect(Resume.schema.path('isActive').options.required).toBe(true);
    expect(resume.uploadedAt).toBeInstanceOf(Date);

    await expect(resume.validate()).resolves.toBeUndefined();
  });

  test('rejects zero, negative, or fractional file sizes', async () => {
    for (const sizeBytes of [0, -1, 1.5]) {
      const resume = new Resume({
        studentProfileId: '507f1f77bcf86cd799439011',
        originalFilename: 'resume.pdf',
        storageKey: 'resumes/example.pdf',
        mimeType: 'application/pdf',
        sizeBytes,
        checksum: 'example-checksum',
      });

      await expect(resume.validate()).rejects.toThrow();
    }
  });

  test('declares an index on studentProfileId', () => {
    const indexes = Resume.schema.indexes();

    expect(
      indexes.some(([fields]) => fields.studentProfileId === 1)
    ).toBe(true);
  });
});