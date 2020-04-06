const assertDto = (dto, validator) => {
  const { error } = validator.validate(dto);
  if (error) throw new Error(error.details[0].message);
};

module.exports = assertDto;
