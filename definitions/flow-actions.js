module.exports = [
  {
    action: 'Netflix',
    command: 'Netflix'
  },
  {
    action: 'SetInput',
    command: args => {
      return args.Input;
    }
  },
  {
    action: 'SetNumber',
    command: args => {
      return args.Number;
    }
  },
  {
    action: 'Options',
    command: 'Options'
  },
  {
    action: 'EPG',
    command: 'EPG'
  },
  {
    action: 'Enter',
    command: 'Enter'
  }
]